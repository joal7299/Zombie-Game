#include "SparkFunLIS3DH.h"
#include "Wire.h"
#include "SPI.h"

//Addresses for both accels
LIS3DH SensorOne( I2C_MODE, 0x19 );
LIS3DH SensorTwo( I2C_MODE, 0x18 );


//Capacative touch vars
int capSensePin = 9;
int capSensePin2 = 10;
//lower number is more sensative
//more resistance makes it more sensative
int touchedCutoff = 17;

char output = 'N';

//for UNO we had 100k resistor with 7-8 cutoff @ 3.3v

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  delay(1000); //relax...
  //Serial.println("Processor came out of reset.\n");

  SensorOne.begin();
  SensorTwo.begin();

  //Call .begin() to configure the IMUs
//  if( SensorOne.begin() != 0 )
//  {
//    Serial.println("Problem starting the sensor at 0x19.");
//  }
//  else
//  {
//    Serial.println("Sensor at 0x19 started.");
//  }
//  if( SensorTwo.begin() != 0 )
//  {
//    Serial.println("Problem starting the sensor at 0x18.");
//  }
//  else
//  {
//    Serial.println("Sensor at 0x18 started.");
//  }
  

}

void loop() {
  //Get all parameters
//  Serial.print("\nAccelerometer:\n");
//  Serial.print(" X1 = ");
//  Serial.println(SensorOne.readFloatAccelX(), 4);
//  Serial.print(" Y1 = ");
//  Serial.println(SensorOne.readFloatAccelY(), 4);
//  Serial.print(" Z1 = ");
//  Serial.println(SensorOne.readFloatAccelZ(), 4);
//  Serial.print(" X2 = ");
//  Serial.println(SensorTwo.readFloatAccelX(), 4);
//  Serial.print(" Y2 = ");
//  Serial.println(SensorTwo.readFloatAccelY(), 4);
//  Serial.print(" Z2 = ");
//  Serial.println(SensorTwo.readFloatAccelZ(), 4);
//  
//  Serial.print("\nSensorOne Bus Errors Reported:\n");
//  Serial.print(" All '1's = ");
//  Serial.println(SensorOne.allOnesCounter);
//  Serial.print(" Non-success = ");
//  Serial.println(SensorOne.nonSuccessCounter);
//  Serial.print("SensorTwo Bus Errors Reported:\n");
//  Serial.print(" All '1's = ");
//  Serial.println(SensorTwo.allOnesCounter);
//  Serial.print(" Non-success = ");
//  Serial.println(SensorTwo.nonSuccessCounter);
//  delay(1000);

  output = 'N';

  //print accel vals
  //forward
  if((SensorOne.readFloatAccelZ() >= 0.75 && SensorOne.readFloatAccelZ() <= 1.5) && (SensorTwo.readFloatAccelZ() >= 0.75 && SensorTwo.readFloatAccelZ() <= 1.5)){
    output = 'F';
//    Serial.print("F");
//    Serial.print(":");
  }
//  else{
//    Serial.print("N");
//    Serial.print(":");
//  }
  

  
  //turn right
  if((SensorOne.readFloatAccelY() >= -1.5 && SensorOne.readFloatAccelY() <= -.75) && (SensorTwo.readFloatAccelZ() >= 0.75 && SensorTwo.readFloatAccelZ() <= 1)){
    output = 'R';
//    Serial.print("R");
//    Serial.print(":");
  }
//  else{
//    Serial.print("N");
//    Serial.print(":");
//  }
  //rotate left
  if((SensorTwo.readFloatAccelY() >= -1.5 && SensorTwo.readFloatAccelY() <= -.75) && (SensorOne.readFloatAccelZ() >= 0.75 && SensorOne.readFloatAccelZ() <= 1)){
    output = 'L';
//    Serial.print("L");
//    Serial.print(":");
  }
//  else{
//    Serial.print("N");
//    Serial.print(":");
//  }


  
//rotate right
  if((SensorOne.readFloatAccelY() >= -1.5 && SensorOne.readFloatAccelY() <= -.75) && (SensorTwo.readFloatAccelY() >= 0.75 && SensorTwo.readFloatAccelY() <= 1.5)){
    output = 'P';
//    Serial.print("P");
//    Serial.print(":");
  }
//  else{
//    Serial.print("N");
//    Serial.print(":");
//  }
  //turn left
  if((SensorTwo.readFloatAccelY() >= -1.5 && SensorTwo.readFloatAccelY() <= -.75) && (SensorOne.readFloatAccelY() >= 0.75 && SensorOne.readFloatAccelY() <= 1.5)){
    output = 'S';
//    Serial.print("S");
//    Serial.print(":");
  }
//  else{
//    Serial.print("N");
//    Serial.print(":");
//  }


  //backwards
  if((SensorOne.readFloatAccelY() >= -1.5 && SensorOne.readFloatAccelY() <= -.75) && (SensorTwo.readFloatAccelY() >= -1.5 && SensorTwo.readFloatAccelY() <= -.75)){
    output = 'B';
//    Serial.print("B");
//    Serial.print(":");
  }

  if(output == 'F' || output == 'R' || output == 'L' || output == 'S' || output == 'P' || output == 'B'){
    Serial.print(output);
    Serial.print(":");
  }
  else{
    output = 'N';
    Serial.print(output);
//    Serial.print("N");
    Serial.print(":");
  }


//  Serial.print(" x: ");
//  Serial.print(SensorOne.readFloatAccelX());
//
//  Serial.print(" y: ");
//  Serial.print(SensorOne.readFloatAccelY());
//
//  Serial.print(" z: ");
//  Serial.print(SensorOne.readFloatAccelZ());


//  Serial.print(" x: ");
//  Serial.print(SensorTwo.readFloatAccelX());
//
//  Serial.print(" y: ");
//  Serial.print(SensorTwo.readFloatAccelY());
//
//  Serial.print(" z: ");
//  Serial.print(SensorTwo.readFloatAccelZ());
  

//  if(SensorOne.readFloatAccelZ() >= 0.75 && SensorOne.readFloatAccelZ() <= 1){
//    Serial.print("F");
//    Serial.print(":");
//  }




  //capacitive touch code, button 1
  if (readCapacitivePin(capSensePin) > touchedCutoff) {
    //digitalWrite(LEDPin, HIGH);
    Serial.print('h');
    //Serial.println(readCapacitivePin(capSensePin));
  }
  else {
    //digitalWrite(LEDPin, LOW);
    Serial.print('l');
    //Serial.println(readCapacitivePin(capSensePin));
  }
  
  Serial.print(':');
  
  //button 2
  if (readCapacitivePin(capSensePin2) > touchedCutoff) {
    //digitalWrite(LEDPin, HIGH);
    Serial.print('h');
    //Serial.println(readCapacitivePin(capSensePin));
  }
  else {
    //digitalWrite(LEDPin, LOW);
    Serial.print('l');
    //Serial.println(readCapacitivePin(capSensePin));
  }
  Serial.print(':');

  Serial.print('\n');

  delay(10);
}


  //cap touch
  uint8_t readCapacitivePin(int pinToMeasure){
  // This is how you declare a variable which
  //  will hold the PORT, PIN, and DDR registers
  //  on an AVR
  volatile uint8_t* port;
  volatile uint8_t* ddr;
  volatile uint8_t* pin;
  // Here we translate the input pin number from
  //  Arduino pin number to the AVR PORT, PIN, DDR,
  //  and which bit of those registers we care about.
  byte bitmask;
  if ((pinToMeasure >= 0) && (pinToMeasure <= 7)){
    port = &PORTD;
    ddr = &DDRD;
    bitmask = 1 << pinToMeasure;
    pin = &PIND;
  }
  if ((pinToMeasure > 7) && (pinToMeasure <= 13)){
    port = &PORTB;
    ddr = &DDRB;
    bitmask = 1 << (pinToMeasure - 8);
    pin = &PINB;
  }
  if ((pinToMeasure > 13) && (pinToMeasure <= 19)){
    port = &PORTC;
    ddr = &DDRC;
    bitmask = 1 << (pinToMeasure - 13);
    pin = &PINC;
  }
  // Discharge the pin first by setting it low and output
  *port &= ~(bitmask);
  *ddr  |= bitmask;
  delay(1);
  // Make the pin an input WITHOUT the internal pull-up on
  *ddr &= ~(bitmask);
  // Now see how long the pin to get pulled up
  int cycles = 16000;
  for(int i = 0; i < cycles; i++){
    if (*pin & bitmask){
      cycles = i;
      break;
    }
  }
  // Discharge the pin again by setting it low and output
  //  It's important to leave the pins low if you want to 
  //  be able to touch more than 1 sensor at a time - if
  //  the sensor is left pulled high, when you touch
  //  two sensors, your body will transfer the charge between
  //  sensors.
  *port &= ~(bitmask);
  *ddr  |= bitmask;
  
  return cycles;

}

  
