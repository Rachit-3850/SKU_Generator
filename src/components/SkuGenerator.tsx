import React, { useState } from "react";
import { useRef } from "react";
import Papa from "papaparse";
import { message } from "antd";
import UI from "./UI";

const SkuGenerator = () => {
	const [value, setValue] = useState<any>(25);
	const [api, contextHolder] = message.useMessage();
	const [data, setData] = useState([]);
	const [upload, setUpload] = useState(false);
	const downloadFlagRef = useRef(false);
	const error = () => {
		api.open({
			type: "error",
			content: "Please check the file format and try again",
			duration: 10,
		});
	};
	const skuLengthError = () => {
		api.open({
			type: "error",
			content: "Length of sku would be between 10 and 50",
			duration: 10,
		});
	};
	const csvRowError = () => {
		api.open({
			type: "error",
			content: "Upload CSV upto 10k rows",
			duration: 10,
		});
	};
	const importDataFromCsv = async (e: any) => {
		setData([])
		// extracting data from csv file
		await Papa.parse(e, {
			header: true,
			skipEmptyLines: true,
			complete: function (result: any) {
				if (value < 10 || value > 50) {
					skuLengthError();
				} else if (result.data.length > 10000) {
					csvRowError();
				} else if (
					result.data.length > 0 &&
					"name" in result.data[0] &&
					"variant_name" in result.data[0]
				) {
					setData(result.data);
				} else {
					error();
				}
			},
		});
		downloadFlagRef.current = false;
		setUpload(false);
	};
	function isVowel(char: any): boolean {
		// check weather character is vowel or not
		if (char.length == 1) {
			var vowels = new Array("A", "E", "I", "O", "U");
			var isVowel = false;

			for (let e in vowels) {
				if (vowels[e] == char) {
					isVowel = true;
				}
			}

			return isVowel;
		}
		return false;
	}

	function isSpecialCharacter(char: any) {
		// check special character
		return char.match(/^[^a-zA-Z0-9]+$/) ? true : false;
	}
	function isPunctuation(char: any) {
		// check punctuation
		let punctArray = [
			"AND",
			"OR",
			"IS",
			"THE",
			"THEN",
			"OF",
			"TO",
			"ARE",
			"IN",
			"ON",
			"I",
		];

		for (let character of punctArray) {
			if (char === character) {
				console.log(char, character);
				return true;
			}
		}
		return false;
	}
	function bracketsAndSymbolsToSpaces(sentence: any) {
		return sentence
			.replaceAll("(", " ")
			.replaceAll(")", " ")
			.replaceAll("[", " ")
			.replaceAll("]", " ")
			.replaceAll("_", " ")
			.replaceAll(".", " ")
			.replaceAll("|", " ")
			.replaceAll("-", " ")
			.replaceAll("/", " ");
	}
	function removeVowelsAndSpecialCharacters(split: any) {
		let ans = "";
		for (let c = 0; c < split.length; c++) {
			// traversing through each word in a string
			var word = split[c];
			if (word.length === 0) {
				// if character is empty than continue
				continue;
			}
			// console.log(word)
			if (isPunctuation(word)) {
				// if character has punctuation than continue
				continue;
			}
			console.log(word);

			for (let index = 0; index < word.length; index++) {
				// traversing through each character in a word
				if (index === 0) {
					// appending first character as it is
					ans = ans + word[index];
				} else {
					if (
						!isVowel(word[index]) && // if character is vowel or special character than skip it
						!isSpecialCharacter(word[index])
					) {
						ans = ans + word[index];
					}
				}
			}
			ans = ans + "-";
		}
		return ans;
	}
	function shrinkNameAttrToLength(attributes: any) {
		let requiredLength = 0;
		// console.log(value);
		if (attributes[1]) {
			requiredLength = value - 3 - attributes[1].length;
		} else {
			requiredLength = value - 2;
		}
		if (attributes[0].length > requiredLength) {
			let element = attributes[0];
			let flag = false;
			for (let found = requiredLength; found >= 0; found--) {
				if (element[found] === "-") {
					attributes[0] = element.substring(0, found);
					flag = true;
					break;
				}
			}
			if (!flag) {
				let capitalOfName = "";
				if (requiredLength > 1) {
					let nameAttr = attributes[0].split("-");

					for (
						let i = 0;
						i < Math.min(requiredLength - 1, nameAttr.length);
						i++
					) {
						capitalOfName += nameAttr[i][0];
					}
					capitalOfName += "-";
				}
				attributes[0] = capitalOfName;
			}
		}
	}
	function generateSku(names: any) {
		// generating sku strings
		let category = [];
		for (let i = 0; i < names.length; i++) {
			// traversing through all the fields
			let attributes = [];
			for (let j = 0; j < 2; j++) {
				// each field contains two categories name and variant_name
				let ans = "";
				let string = names[i][j];
				string = string.toUpperCase();
				if (string.length == 0) {
					continue;
				}
				string = bracketsAndSymbolsToSpaces(string);
				let split = string.split(" ");
				if (split.length === 1) {
					// if there is only single word inside the sentence than return whole word
					ans += split[0] + "-";
				} else {
					// else applying algo to remove vowel and special characters

					ans = removeVowelsAndSpecialCharacters(split);
				}
				if (ans.charAt(ans.length - 1) == "-") {
					ans = ans.substring(0, ans.length - 1);
				}
				attributes.push(ans);
			}

			// shrinking name field to make a sku for less than specific length
			shrinkNameAttrToLength(attributes);
			// console.log(attributes)
			let result = "";
			if (attributes[0] && attributes[0].length > 0) {
				result += attributes[0];
			}
			result += "-";
			if (attributes[1] && attributes[1].length > 0) {
				result += attributes[1];
			}
			category.push(result);
		}
		return category;
	}
	var getUniqueSku = function (names: any) {
		// allotting unique sku to every field
		let hash: any = new Set(); // using set
		for (const name of names) {
			if (!hash.has(name)) {
				hash.add(name);
			} else {
				let count = 1;
				let temp = name;
				while (hash.has(temp)) {
					temp = name + `-${count}`;
					count++;
				}
				hash.add(temp);
			}
		}
		return [...hash];
	};

	// generate export data to sku
	const exportDataToCsv = function (data: any) {
		// converting data to downloading format
		let names = [];
		//pushing all the data to array
		for (let colData of data) {
			if (!("name" in colData) || !("variant_name" in colData)) {
				return [];
			}
			let name = [];
			name.push(colData["name"]);
			name.push(colData["variant_name"]);
			// name.push(colData["category"]);
			names.push(name);
		}
		let generatedSku = generateSku(names);
		let uniqueSku = getUniqueSku(generatedSku);
		let length = data.length;
		let temp = [];
		for (let i = 0; i < length; i++) {
			// pushing all tha fields into a object
			temp.push(Object.values(data[i]));
			temp[i].push(uniqueSku[i]);
		}
		var keys = Object.keys(data[0]);
		keys.push("sku"); // converting data in csv format

		let finalResult = "";
		finalResult += keys.join(",");
		finalResult += "\r\n";
		for (let i = 0; i < length; i++) {
			let row = temp[i].join(",");
			finalResult += row + "\r\n";
		}
		// let finalResult = [];
		// finalResult.push(keys);
		// for (let i = 0; i < length; i++) {
		// 	finalResult.push(temp[i]);
		// }

		return finalResult;
	};

	return (
		<>
			{contextHolder}
			{/* <UI importDataFromCsv = {importDataFromCsv} exportDataToCsv = {exportDataToCsv} data = {data} value = {value} setValue = {setValue}/> */}
			<UI
				downloadFlagRef={downloadFlagRef}
				importDataFromCsv={importDataFromCsv}
				exportDataToCsv={exportDataToCsv}
				data={data}
				upload = {upload}
				setUpload = {setUpload}
				value={value}
				setValue={setValue}
			/>
		</>
	);
};
export default SkuGenerator;
