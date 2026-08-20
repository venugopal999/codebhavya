(function(){
    "use strict";
    window.CodeBhavyaMathQuestions=[
        {question:"What is the probability of getting a head when a fair coin is tossed once?",options:["1/2","1/3","1/4","1"],answer:0,difficulty:"easy",solution:"A fair coin has two equally likely outcomes and one is a head, so P(head)=1/2."},
        {question:"What is the probability of rolling an even number on a fair six-sided die?",options:["1/3","1/2","2/3","1/6"],answer:1,difficulty:"easy",solution:"Even outcomes are {2,4,6}. Thus P(even)=3/6=1/2."},
        {question:"What is the probability of an impossible event?",options:["1","1/2","0","−1"],answer:2,difficulty:"easy",solution:"An impossible event has no favourable outcomes, so its probability is 0."},
        {question:"What is the probability of a certain event?",options:["0","1/2","2","1"],answer:3,difficulty:"easy",solution:"A certain event contains the complete sample space, so its probability is 1."},
        {question:"If P(A)=0.3, what is P(A′)?",options:["0.7","0.3","1.3","0"],answer:0,difficulty:"easy",solution:"P(A′)=1−P(A)=1−0.3=0.7."},
        {question:"Two fair coins are tossed. What is the probability of two heads?",options:["1/2","1/4","3/4","1/8"],answer:1,difficulty:"medium",solution:"The outcomes are HH, HT, TH and TT. Only HH is favourable, so the probability is 1/4."},
        {question:"A fair die is rolled. What is the probability of obtaining a number greater than 4?",options:["1/2","2/3","1/3","1/6"],answer:2,difficulty:"medium",solution:"The favourable outcomes are 5 and 6. P=2/6=1/3."},
        {question:"Mutually exclusive events have P(A)=0.20 and P(B)=0.35. Find P(A∪B).",options:["0.15","0.07","0.70","0.55"],answer:3,difficulty:"medium",solution:"Mutually exclusive events have no overlap, so P(A∪B)=0.20+0.35=0.55."},
        {question:"Independent events have P(A)=0.5 and P(B)=0.4. Find P(A∩B).",options:["0.20","0.90","0.10","0.45"],answer:0,difficulty:"medium",solution:"For independent events, P(A∩B)=P(A)P(B)=0.5×0.4=0.20."},
        {question:"Independent events each occur with probability 0.5. What is the probability that at least one occurs?",options:["0.50","0.75","0.25","1"],answer:1,difficulty:"medium",solution:"P(at least one)=1−P(neither)=1−(0.5×0.5)=0.75."},
        {question:"What is the probability of drawing an ace from a standard 52-card deck?",options:["1/4","1/12","1/13","4/13"],answer:2,difficulty:"medium",solution:"There are 4 aces among 52 cards, so P(ace)=4/52=1/13."},
        {question:"If P(A∩B)=0.12 and P(B)=0.30, find P(A|B).",options:["0.18","0.036","0.25","0.40"],answer:3,difficulty:"medium",solution:"P(A|B)=P(A∩B)/P(B)=0.12/0.30=0.40."},
        {question:"Two fair coins are tossed. What is the probability of exactly one head?",options:["1/2","1/4","3/4","1"],answer:0,difficulty:"medium",solution:"Exactly one head occurs in HT and TH, so the probability is 2/4=1/2."},
        {question:"A bag contains 3 red and 2 blue balls. Two are drawn without replacement. Find P(both red).",options:["2/5","3/10","9/25","1/5"],answer:1,difficulty:"medium",solution:"P(both red)=3/5×2/4=6/20=3/10."},
        {question:"What is the expected value of a fair six-sided die?",options:["3","4","3.5","2.5"],answer:2,difficulty:"medium",solution:"E(X)=(1+2+3+4+5+6)/6=21/6=3.5."},
        {question:"Three fair coins are tossed. What is the probability of at least one head?",options:["1/8","3/8","3/4","7/8"],answer:3,difficulty:"hard",solution:"Use the complement: 1−P(all tails)=1−(1/2)³=1−1/8=7/8."},
        {question:"How many different 5-card hands can be selected from a standard 52-card deck?",options:["2,598,960","52⁵","260","120"],answer:0,difficulty:"hard",solution:"Order does not matter, so the count is ⁵²C₅=2,598,960."},
        {question:"Four fair coins are tossed. What is the probability of exactly two heads?",options:["1/4","3/8","1/2","5/8"],answer:1,difficulty:"hard",solution:"Choose the 2 head positions in ⁴C₂=6 ways out of 2⁴=16 outcomes. Probability=6/16=3/8."},
        {question:"An integer is selected uniformly from 1 to 100. What is the probability it is divisible by 3 or 5?",options:["53/100","40/100","47/100","1/2"],answer:2,difficulty:"hard",solution:"There are 33 multiples of 3 and 20 of 5. Subtract 6 multiples of 15: 33+20−6=47, so P=47/100."},
        {question:"Three independent components each work with probability 0.9. What is the probability all three work?",options:["0.90","0.81","0.27","0.729"],answer:3,difficulty:"hard",solution:"Independence allows multiplication: 0.9³=0.729."}
    ];
}());
