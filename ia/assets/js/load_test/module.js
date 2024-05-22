"use strict";

// 모듈 실헹방식 테스트
const myModule = (function () {
  // 내부에서 사용
  let value = "value";
  const getValue = (text) => {
    value = text
  };

  // 외부함수
  const setValue = () => {
    getValue("test!!!");
    console.log(value);
  };


  const publicFunction = () => {
    // 외부에서 접근할 수 있는 함수
    console.log("Public function called");
    setValue();
  };

  // 외부로 노출될 함수나 변수를 반환
  return {
    publicFunction: publicFunction
  };
})();
// 모듈에서 publicFunction 호출
myModule.publicFunction();



// 테스트2
const myModule2 = (function () {
  let counter = 0;

  const incrementCounter = () => {
    counter++;
  };

  const resetCounter = () => {
    counter = 0;
  };

  const getCounterValue = () => {
    return counter;
  };

  const incrementAndLogCounter = () => {
    incrementCounter();
    console.log(`Counter incremented to ${counter}`);
  };

  const publicFunction = () => {
    incrementAndLogCounter();
  };

  return {
    publicFunction: publicFunction,
    getCounterValue: getCounterValue
  };
})();

myModule2.publicFunction(); // Counter incremented to 1
myModule2.publicFunction(); // Counter incremented to 2

console.log(myModule2.getCounterValue()); // 2