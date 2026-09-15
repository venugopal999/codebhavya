"use strict";
const { main, makeJava }=require("./helpers");
const T="Level 07 — Strings & Text Processing";
const e=(slug,title,body,out,concepts,extra={})=>makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:main(body,extra.imports||""),sampleOutput:out,concepts,...extra});
module.exports=[
 e("string-create-length","Create a String and Find Its Length",'String text="CodeBhavya";\nSystem.out.println(text.length());',"10",["String","length()"]),
 e("string-character-access","Access String Characters",'String text="Java";\nSystem.out.println(text.charAt(0)+" "+text.charAt(text.length()-1));',"J a",["charAt()","Indexing"]),
 e("string-comparison","Compare Strings Correctly",'String first=new String("Java"),second="Java";\nSystem.out.println(first==second);\nSystem.out.println(first.equals(second));',"false\ntrue",["equals()","Reference comparison"]),
 e("string-case-conversion","Convert String Case",'String text="CodeBhavya";\nSystem.out.println(text.toUpperCase());\nSystem.out.println(text.toLowerCase());',"CODEBHAVYA\ncodebhavya",["toUpperCase()","toLowerCase()"]),
 e("string-trim-spaces","Remove Surrounding Spaces",'String text="   Java Practice   ";\nSystem.out.println(text.trim());',"Java Practice",["trim()","Whitespace"]),
 e("string-substring","Extract a Substring",'String text="Learn Java Daily";\nSystem.out.println(text.substring(6,10));',"Java",["substring()","Exclusive end"]),
 e("string-search","Search Inside a String",'String text="Learn Java at CodeBhavya";\nSystem.out.println(text.indexOf("Java"));\nSystem.out.println(text.contains("Bhavya"));',"6\ntrue",["indexOf()","contains()"]),
 e("string-replace","Replace Text",'String text="I learn C";\nSystem.out.println(text.replace("C","Java"));',"I learn Java",["replace()","Immutability"]),
 e("string-split-join","Split and Join Words",'String text="learn build share";\nString[] words=text.split(" ");\nSystem.out.println(String.join("-",words));',"learn-build-share",["split()","String.join()"]),
 e("reverse-string","Reverse a String",'String text="Java";\nSystem.out.println(new StringBuilder(text).reverse());',"avaJ",["StringBuilder","reverse()"]),
 e("palindrome-string","Check a Palindrome String",'String text="level";\nString reversed=new StringBuilder(text).reverse().toString();\nSystem.out.println(text.equals(reversed));',"true",["Palindrome","equals()"]),
 e("count-vowels-string","Count Vowels in a String",'String text="Artificial Intelligence".toLowerCase(); int count=0;\nfor(char ch:text.toCharArray())if("aeiou".indexOf(ch)>=0)count++;\nSystem.out.println(count);',"10",["toCharArray()","Vowel test"]),
 e("character-frequency","Count Character Frequency",'String text="banana";\njava.util.Map<Character,Integer> count=new java.util.TreeMap<>();\nfor(char ch:text.toCharArray())count.merge(ch,1,Integer::sum);\nSystem.out.println(count);',"{a=3, b=1, n=2}",["TreeMap","merge()"],{imports:"import java.util.*;",space:"O(k)"}),
 e("anagram-check","Check Two Anagrams",'char[] first="listen".toCharArray(),second="silent".toCharArray();\njava.util.Arrays.sort(first);java.util.Arrays.sort(second);\nSystem.out.println(java.util.Arrays.equals(first,second));',"true",["Anagram","Arrays.equals()"],{time:"O(n log n)",space:"O(n)"}),
 e("stringbuilder-mutation","Build Text Efficiently",'StringBuilder result=new StringBuilder();\nfor(int i=1;i<=4;i++)result.append(i).append(i<4?"-":"");\nSystem.out.println(result);',"1-2-3-4",["StringBuilder","append()"])
];
