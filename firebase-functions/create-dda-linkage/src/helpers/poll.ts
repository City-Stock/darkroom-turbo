/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
export default async function poll(
  fn: any,
  fnCondition: any,
  ms: number,
  message: string
) {
  let result = await fn();


  while (fnCondition(result)) {
    console.log(message);
    await wait(ms);
    result = await fn();
  }

  return result;
}

function wait(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
