#include <Arduino.h>
#include <EEPROM.h>
#include <stdint.h>
#include <IRUtils.h>
#include <IRsend.h>
#include <ir_Gree.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>

// Config
// Params sent to AC
#define CMD_PARAMS 10

// How many times the command must be sent by IR
// Default 3 times, 1.5secs delay between each repetition
#define CMD_REPEAT 3
#define CMD_DELAY 1500

// IR on D2 (GPIO4)
#define IR_PIN D2

// SSID and Password
// @todo use captive portal
const char* ssid = "GreeAP";
const char* password = "GreeAP123";

IRGreeAC ac(IR_PIN);
ESP8266WebServer server(80);

// AC Remote last/default command command saved into this array
uint8_t state[10];

// Check if state contains allowed values
// If not then replace the content with default values
// [0,24,0,1,1,1,0,0,0,1]
void state_check()
{
  // command format: [mode, temp, fan_speed,
  //                  flap_auto_flag, flap,
  //                  light, turbo, xfan, sleep, on_off]
  uint8_t options = 1;
  for (uint8_t j = 5; j < CMD_PARAMS; j++)
  {
    if (state[j] < 0 || state[j] > 1) 
    {
      options = 0;
      break;
    }
  }

  uint8_t temp = (state[1] < 16 || state[1] > 31) ? 0 : 1;
  uint8_t flap_flag_auto = (state[3] < 0 || state[3] > 1) ? 0 : 1;
  uint8_t flap = (state[4] < 1 || state[4] > 11) ? 0 : 1;
  uint8_t fan = (state[2] < 0 || state[2] > 3) ? 0 : 1;
  uint8_t mode = (state[0] < 0 || state[0] > 4) ? 0 : 1;
  
  if (!(mode && temp && options && flap_flag_auto && fan && flap))
  {
    Serial.println("Incorrect values stored in state[], resetting to default.");
    state[0] = 0;
    state[1] = 24;
    state[2] = 0;
    state[3] = 1;
    state[4] = 1;
    state[5] = 1;
    state[6] = 0;
    state[7] = 0;
    state[8] = 0;
    state[9] = 0;
    EEPROM.put(0, state);
    EEPROM.commit();
  }
}

// Handle invalid URLs
void handleNotFound()
{
  String message = "error";
  
  if (server.method() == HTTP_OPTIONS)
    {
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Max-Age", "10000");
        server.sendHeader("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "*");
        server.send(204);
    } else {
        server.send(404, "text/plain", message);
    }
}

// Get current state
void getAcRemote()
{
  String string_state = "[";
  for (int i = 0; i < CMD_PARAMS; i++)
  {
    char *current = (char *)malloc(sizeof(char) * 4);
    snprintf(current, sizeof(char) * 3, "%d", state[i]);
    
    string_state += current;
    if (i < 9)
    {
      string_state += ",";
    }
    free(current);
  }
  string_state += "]";
  
  Serial.println(string_state);
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", string_state);
}

// Set state
void postAcRemote()
{ 
  String command = server.arg("command");
  char tochar[command.length() + 1];
  command.toCharArray(tochar, command.length() + 1);

  char *current_int = strtok(tochar, ",");
  int command_index = 0;
  uint16_t command_received[CMD_PARAMS];

  while (current_int != NULL && command_index < CMD_PARAMS)
  {
    command_received[command_index++] = atoi(current_int);
    current_int = strtok(NULL, ",");
  }

  // Command format: [mode, temp, fan_speed,
  //                  flap_auto_flag, flap,
  //                  light, turbo, xfan, sleep, on_off]
  // Executed only if we are turning on the AC..
  if (command_received[9] == 1)
  {
    ac.setMode(command_received[0]);
    ac.setTemp(command_received[1]);
    ac.setFan(command_received[2]);
    ac.setSwingVertical(command_received[3], command_received[4]);
    ac.setLight(command_received[5]);
    ac.setTurbo(command_received[6]);
    ac.setXFan(command_received[7]);
    ac.setSleep(command_received[8]);

    // Save params if we are not turning off
    for (int h = 0; h < CMD_PARAMS - 1; h++)
    {
      state[h] = command_received[h];
    }
  }
  ac.setPower(command_received[9]);

  // And save also in state if last command was a command or Off
  state[9] = command_received[9];
  
  // Send signal to AC
  int send_cmd_repeat = 0;
  while (send_cmd_repeat < CMD_REPEAT)
  {
    ac.send();
    delay(CMD_DELAY);
    send_cmd_repeat++;
  }

  // Save to memory
  EEPROM.put(0, state);
  EEPROM.commit();

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "success");
}

void setup()
{
  Serial.begin(115200);

  // Connect to wifi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print("*");
  }

  // EEPROM for state[]
  EEPROM.begin(CMD_PARAMS * sizeof(uint8_t));
  EEPROM.get(0, state);
  state_check();

  // IR set last known state
  ac.begin();
  ac.setMode(state[0]);
  ac.setTemp(state[1]);
  ac.setFan(state[2]);
  ac.setSwingVertical(state[3], state[4]);
  ac.setLight(state[5]);
  ac.setTurbo(state[6]);
  ac.setXFan(state[7]);
  ac.setSleep(state[8]);
  ac.setPower(state[9]);

  // Server
  server.on("/get-ac", HTTP_GET, getAcRemote);
  server.on("/post-ac", HTTP_POST, postAcRemote);
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop()
{
  server.handleClient();
}