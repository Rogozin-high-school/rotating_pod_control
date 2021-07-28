/**
 * Rotating POD simple controller.
 * 
 * Author: Yotam Salmon
 * 
 * Last edit: Yanir Harel, 25/7/2021
 * 
 * TODO: Please fill in the correct values for steps per revolution (i couldn't find them for our motor)
 * 
 * Note: For information about wiring, this program is based on the following guide:
 *      https://www.arduino.cc/en/Tutorial/LibraryExamples/StepperSpeedControl
 */

#include <Stepper.h>

// The speeds are in steps!!!
constexpr int STEPS_PER_REVOLUTION = 200;
constexpr int SCAN_SPEED = 10;
constexpr int RETREAT_SPEED = 40;
constexpr int ARC_SIZE = STEPS_PER_REVOLUTION / 4;

constexpr int STEPPER_FIRST_PIN = 0;
constexpr int STEPPER_SECOND_PIN = 2;
constexpr int STEPPER_THIRD_PIN = 14;
constexpr int STEPPER_FOURTH_PIN = 12;

Stepper motor(
    STEPS_PER_REVOLUTION,
    STEPPER_FIRST_PIN,
    STEPPER_SECOND_PIN,
    STEPPER_THIRD_PIN,
    STEPPER_FOURTH_PIN
);



typedef enum {
    SCAN,
    RETREAT
} ScanStep;

uint32_t steps_from_origin = 0;
ScanStep pod_status = SCAN;

void setup() {
	
}

void loop() {
	int32_t direction = pod_status == SCAN ? 1 : -1;
    int32_t speed = pod_status == SCAN ? SCAN_SPEED : RETREAT_SPEED;

    motor.setSpeed(speed);
    motor.step(direction);

    steps_from_origin += direction;

    if (pod_status == SCAN && steps_from_origin >= ARC_SIZE)
    {
        pod_status = RETREAT;
    }
    else if (pod_status == RETREAT && steps_from_origin == 0)
    {
        pod_status = SCAN;
    }
}