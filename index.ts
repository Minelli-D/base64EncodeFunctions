/**
 * Author: D. Minelli 
 * Title: Base64 encode with padding
 */

//Generate uppercase alphabet A-Z
const alphabet = new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));

/**
 * Create BASE64 Map Rif: {@link https://en.wikipedia.org/wiki/Base64}
 * @returns Map<number,string> Base64 Map
 */
const initBase64Map = (): Map<number, string> => {
  //lower case insert 1 - 25 keys, A - Z values
  let map: Map<number, string> = new Map();
  alphabet.forEach((ch, index) => {
    map.set(index, ch);
  });
  let sizeMap = map.size;
  //lower case insert 26 - 51 keys, a - z values
  alphabet.forEach((ch, index) => {
    map.set(sizeMap + index, ch.toLowerCase());
  });
  sizeMap = map.size;
  //52-61 keys, 0=9 values
  Array.from(Array(10).keys()).forEach((num, index) => {
    map.set(sizeMap + index, (num).toString());
  });
  map.set(62, '+');
  map.set(63, '/');
  return map;
}
const base64Map: Map<number, string> = initBase64Map();

/**
 * Convert the string in string array rappresented a 8-bit for every char of string
 * @param str 
 * @returns Array<string> 8-bit for every char of string
 */
const textToBinary = (str = ''): Array<string> => {
  let res: Array<string> = [];
  res = str.split('').map(char => {
    return char.charCodeAt(0).toString(2);
  });
  let resFinal: Array<string> = [];
  res.forEach(element => {
    let appElement = element;
    while (appElement.length <= 7) {
      appElement = "0" + appElement;
    }
    resFinal.push(appElement);

  });
  return resFinal;
};

/**
 * Pass a joined string, it divided in group by number you pass
 * @param array 
 * @param size 
 * @returns  An array T[][] grouped by size you passed
 */
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const arr: T[][] = [];
  for (let i = 0, j = array.length; i < j; i += size) {
    arr.push(array.slice(i, i + size));
  }
  return arr;
}

/**
 * If the array bit length isn't divided for 3, add 0 at the end.
 * @param arr 
 * @returns Array<string> the new array with end zeros in the last bit 
 */
const addEndZeros = (arr: Array<string>) => {

  let arrClone: Array<string> = [];

  arr.forEach(element => arrClone.push(element));

  while ((arrClone.join('').length % 3)) {
    arrClone.push('0');
  }

  return arrClone;

};

/**
 * Set of istruction for encoding the string in base64
 * @param str the string you wanna encode 
 * @returns  the string converted
 */
const toBase64 = function (str: string): string|undefined {
  if(str == "" || str == null){
    console.log("You can't encode a empty or null string, return empty value");
    return "";
  }

  let binaryListOneTake: Array<string> = addEndZeros(textToBinary(str));
  let sliceToSixGroup: string[][] = chunkArray(binaryListOneTake.join('').split(""), 6);

  //traslate the decimal(bit value) checking the base64Map
  let codedString: (string | undefined)[] = [];
  sliceToSixGroup.forEach((e) => {
    let t: number = parseInt(e.join(''), 2);
    codedString.push(base64Map.get(t));
  })

  //Add padding, check the latest 2Byte
  let arrayForPadding: (string | undefined)[][] = chunkArray(codedString, 4);
  while (arrayForPadding[arrayForPadding.length - 1].length < 4) {
    arrayForPadding[arrayForPadding.length - 1] = arrayForPadding[arrayForPadding.length - 1].concat("=");
  }

  //'Traslate'[][] in a string 
  let finalString: string = "";
  arrayForPadding.forEach(e => {
    e.forEach(d => {
      if (finalString != null)
        finalString = finalString.concat(d != null ? d : '');
    });
  });
  return finalString;
}

const str1 = "this is a string!!";
const str2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const str3 = "Man";
const str4 = "Ma";
console.log(`Initial string: ${str1} | encoded string: ${toBase64(str1)}`);
console.log(`Initial string: ${str2} | encoded string: ${toBase64(str2)}`);
console.log(`Initial string: ${str3} | encoded string: ${toBase64(str3)}`); 
console.log(`Initial string: ${str4} | encoded string: ${toBase64(str4)}`);
