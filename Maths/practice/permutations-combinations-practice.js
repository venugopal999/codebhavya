(function(){
    "use strict";
    window.CodeBhavyaMathQuestions=[
        {question:"Evaluate 4!.",options:["24","16","12","8"],answer:0,difficulty:"easy",solution:"4! = 4×3×2×1 = 24."},
        {question:"A student has 3 shirts and 2 trousers. How many different outfits can be formed?",options:["5","6","8","9"],answer:1,difficulty:"easy",solution:"Choose one shirt and one trouser: 3×2 = 6 outfits."},
        {question:"Which situation requires a permutation?",options:["Selecting 2 fruits","Choosing a 3-member team","Awarding first, second and third places","Selecting 4 test cases"],answer:2,difficulty:"easy",solution:"The ranks are different positions, so changing the order changes the outcome. Therefore, use a permutation."},
        {question:"Evaluate ⁵C₂.",options:["20","15","5","10"],answer:3,difficulty:"easy",solution:"⁵C₂ = 5!/(2!3!) = 5×4/2 = 10."},
        {question:"Evaluate ⁵P₂.",options:["20","10","25","5"],answer:0,difficulty:"easy",solution:"⁵P₂ = 5!/(5−2)! = 5×4 = 20."},
        {question:"Simplify 7!/5!.",options:["35","42","49","14"],answer:1,difficulty:"medium",solution:"7!/5! = 7×6×5!/5! = 42."},
        {question:"How many 3-member committees can be selected from 7 people?",options:["21","28","35","210"],answer:2,difficulty:"medium",solution:"Order does not matter: ⁷C₃ = 7×6×5/(3×2×1) = 35."},
        {question:"How many distinct arrangements are possible for the word BOOK?",options:["24","8","6","12"],answer:3,difficulty:"medium",solution:"BOOK has 4 letters with O repeated twice. The number is 4!/2! = 12."},
        {question:"In how many ways can 5 people sit around a round table?",options:["24","120","20","60"],answer:0,difficulty:"medium",solution:"Circular arrangements of 5 distinct people = (5−1)! = 4! = 24."},
        {question:"How many four-digit codes are possible using digits 0–9 when repetition is allowed?",options:["1,000","10,000","5,040","9,000"],answer:1,difficulty:"medium",solution:"Each of 4 positions has 10 choices, so the count is 10⁴ = 10,000."},
        {question:"How many ways can 2 representatives be selected from 5 students?",options:["5","20","10","25"],answer:2,difficulty:"medium",solution:"The representatives have identical roles, so choose 2 from 5: ⁵C₂ = 10."},
        {question:"What is the value of ⁿC₀ for every non-negative integer n?",options:["0","n","n!","1"],answer:3,difficulty:"medium",solution:"There is exactly one way to select no objects: choose the empty set. Therefore, ⁿC₀ = 1."},
        {question:"Evaluate ⁸P₃.",options:["336","56","512","24"],answer:0,difficulty:"medium",solution:"⁸P₃ = 8×7×6 = 336."},
        {question:"A password has 2 lowercase letters followed by 2 digits. Repetition is allowed. How many passwords exist?",options:["65,000","67,600","6,760","45,000"],answer:1,difficulty:"medium",solution:"The count is 26×26×10×10 = 26²×10² = 67,600."},
        {question:"How many non-empty subsets does a 5-element set have?",options:["16","25","31","32"],answer:2,difficulty:"medium",solution:"A 5-element set has 2⁵ = 32 subsets. Removing the empty set leaves 31."},
        {question:"How many distinct arrangements are possible for BANANA?",options:["120","30","90","60"],answer:3,difficulty:"hard",solution:"BANANA has 6 letters with A repeated 3 times and N repeated 2 times. Count = 6!/(3!2!) = 60."},
        {question:"Six people sit in a row. In how many arrangements must A and B sit together?",options:["240","120","480","720"],answer:0,difficulty:"hard",solution:"Treat A and B as one block. Arrange 5 units in 5! ways and arrange A,B internally in 2! ways: 5!×2 = 240."},
        {question:"How many diagonals does a hexagon have?",options:["6","9","12","15"],answer:1,difficulty:"hard",solution:"Choose any 2 of 6 vertices to form a segment: ⁶C₂ = 15. Remove the 6 sides, leaving 15−6 = 9 diagonals."},
        {question:"How many length-4 strings can be formed from 6 distinct symbols without repetition?",options:["1,296","120","360","24"],answer:2,difficulty:"hard",solution:"Order matters and repetition is forbidden: ⁶P₄ = 6×5×4×3 = 360."},
        {question:"How many ways can at least one item be selected from 8 distinct items?",options:["128","256","64","255"],answer:3,difficulty:"hard",solution:"There are 2⁸ = 256 subsets in total. Exclude the empty set: 256−1 = 255."}
    ];
}());
