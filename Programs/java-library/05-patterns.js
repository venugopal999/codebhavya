"use strict";
const { main, makeJava }=require("./helpers");
const T="Level 05 — Pattern Programs";
const e=(slug,title,body,out,concepts)=>makeJava({slug:`java-${slug}`,title:`${title} in Java`,topic:T,source:main(body),sampleOutput:out,concepts,time:"O(n²)",space:"O(1)"});
module.exports=[
 e("right-triangle-pattern","Print a Right Triangle",'for(int row=1;row<=4;row++){ for(int col=1;col<=row;col++) System.out.print("*"); System.out.println(); }',"*\n**\n***\n****",["Nested loops","Triangle"]),
 e("inverted-triangle-pattern","Print an Inverted Triangle",'for(int row=4;row>=1;row--){ for(int col=1;col<=row;col++) System.out.print("*"); System.out.println(); }',"****\n***\n**\n*",["Nested loops","Decreasing bound"]),
 e("square-pattern","Print a Solid Square",'for(int row=1;row<=4;row++){ for(int col=1;col<=4;col++) System.out.print("* "); System.out.println(); }',"* * * *\n* * * *\n* * * *\n* * * *",["Nested loops","Square"]),
 e("hollow-square-pattern","Print a Hollow Square",'int n=4;\nfor(int row=1;row<=n;row++){ for(int col=1;col<=n;col++) System.out.print(row==1||row==n||col==1||col==n?"* ":"  "); System.out.println(); }',"* * * *\n*     *\n*     *\n* * * *",["Boundary condition","Hollow pattern"]),
 e("number-triangle-pattern","Print a Number Triangle",'for(int row=1;row<=4;row++){ for(int n=1;n<=row;n++) System.out.print(n+" "); System.out.println(); }',"1\n1 2\n1 2 3\n1 2 3 4",["Number pattern","Nested loops"]),
 e("floyd-triangle","Print Floyd's Triangle",'int value=1;\nfor(int row=1;row<=4;row++){ for(int col=1;col<=row;col++) System.out.print(value+++" "); System.out.println(); }',"1\n2 3\n4 5 6\n7 8 9 10",["Floyd triangle","Running value"]),
 e("pyramid-pattern","Print a Centered Pyramid",'int n=4;\nfor(int row=1;row<=n;row++){ for(int s=0;s<n-row;s++) System.out.print(" "); for(int c=0;c<2*row-1;c++) System.out.print("*"); System.out.println(); }',"   *\n  ***\n *****\n*******",["Spacing","Pyramid"]),
 e("inverted-pyramid-pattern","Print an Inverted Pyramid",'int n=4;\nfor(int row=n;row>=1;row--){ for(int s=0;s<n-row;s++) System.out.print(" "); for(int c=0;c<2*row-1;c++) System.out.print("*"); System.out.println(); }',"*******\n *****\n  ***\n   *",["Nested loops","Inverted pyramid"]),
 e("diamond-pattern","Print a Diamond",'int n=3;\nfor(int row=1;row<=n;row++){ System.out.print(" ".repeat(n-row)); System.out.println("*".repeat(2*row-1)); }\nfor(int row=n-1;row>=1;row--){ System.out.print(" ".repeat(n-row)); System.out.println("*".repeat(2*row-1)); }',"  *\n ***\n*****\n ***\n  *",["String.repeat()","Diamond"]),
 e("pascal-triangle","Print Pascal's Triangle",'for(int row=0;row<5;row++){ int value=1; for(int col=0;col<=row;col++){ System.out.print(value+" "); value=value*(row-col)/(col+1); } System.out.println(); }',"1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1",["Pascal triangle","Binomial coefficient"])
];
