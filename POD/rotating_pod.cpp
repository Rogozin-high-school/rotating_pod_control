/**
 * Rotating POD simple controller.
 * 
 * Author: Yotam Salmon
 * 
 * Last edit: Yanir Harel, 1/8/2021
 * 
 * TODO: Please fill in the correct values for steps per revolution (i couldn't find them for our motor)
 * 
 * Note: For information about wiring, this program is based on the following guide:
 *      https://www.arduino.cc/en/Tutorial/LibraryExamples/StepperSpeedControl
 */

#include <ESP8266WiFi.h>
#include <SPI.h>
#include <Stepper.h>

// The speeds are in steps!!!
uint16 stepsPerRevolution = 200;
uint16 scanSpeed = 10;
uint16 retreatSpeed = 40;
uint16 arcSize = stepsPerRevolution / 4;

constexpr uint8 STEPPER_FIRST_PIN = 0;
constexpr uint8 STEPPER_SECOND_PIN = 2;
constexpr uint8 STEPPER_THIRD_PIN = 14;
constexpr uint8 STEPPER_FOURTH_PIN = 12;
constexpr uint8 STEPS_OFFSET = 0;
constexpr uint8 SCAN_OFFSET = 2;
constexpr uint8 RETREAT_OFFSET = 4;
constexpr uint8 ARC_OFFSET = 6;

Stepper motor(
    stepsPerRevolution,
    STEPPER_FIRST_PIN,
    STEPPER_SECOND_PIN,
    STEPPER_THIRD_PIN,
    STEPPER_FOURTH_PIN);

typedef enum {
    SCAN,
    RETREAT
} ScanStep;

uint32_t steps_from_origin = 0;
ScanStep pod_status = SCAN;

// Wifi configurations
char ssid[] = "ShlinziGibu";
char pass[] = "12345678";

const uint8 MSG_SIZE = 8;

int status = WL_IDLE_STATUS;
IPAddress server(192, 168, 43, 188);

WiFiClient client;

void setup() {
    WiFi.begin(ssid, pass);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

    status = client.connect(server, 1234);
}

void loop() {
    int32_t direction = pod_status == SCAN ? 1 : -1;
    int32_t speed = pod_status == SCAN ? scanSpeed : retreatSpeed;

    motor.setSpeed(speed);
    motor.step(direction);

    steps_from_origin += direction;

    if (pod_status == SCAN && steps_from_origin >= arcSize) {
        pod_status = RETREAT;
    } else if (pod_status == RETREAT && steps_from_origin == 0) {
        pod_status = SCAN;
        if (status) {
            client.print("ready");
            char msg[MSG_SIZE] = { 0 };
            client.readBytes(msg, MSG_SIZE);
            stepsPerRevolution = (((uint16)msg[STEPS_OFFSET + 1]) << 8) | msg[STEPS_OFFSET];
            scanSpeed = (((uint16)msg[SCAN_OFFSET + 1]) << 8) | msg[SCAN_OFFSET];
            retreatSpeed = (((uint16)msg[RETREAT_OFFSET + 1]) << 8) | msg[RETREAT_OFFSET];
            arcSize = (((uint16)msg[ARC_OFFSET + 1]) << 8) | msg[ARC_OFFSET];
        } else {
            status = client.connect(server, 1234);
        }
    }
}