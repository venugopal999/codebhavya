(function () {
    "use strict";

    window.CodeBhavyaMathQuestions = [
        {question:"What is the order of a matrix having 2 rows and 3 columns?",options:["2 × 3","3 × 2","2 + 3","6 × 1"],answer:0,difficulty:"easy",solution:"Matrix order is written as rows × columns. Therefore, the order is 2 × 3."},
        {question:"For A = [[4,7],[2,5]], what is A₂₁?",options:["7","2","4","5"],answer:1,difficulty:"easy",solution:"A₂₁ means row 2, column 1. That element is 2."},
        {question:"Which matrix is the 2 × 2 identity matrix?",options:["[[0,0],[0,0]]","[[1,1],[1,1]]","[[1,0],[0,1]]","[[0,1],[1,0]]"],answer:2,difficulty:"easy",solution:"An identity matrix has 1 on its main diagonal and 0 elsewhere: [[1,0],[0,1]]."},
        {question:"What is the order of the transpose of a 1 × 3 matrix?",options:["1 × 3","3 × 3","1 × 1","3 × 1"],answer:3,difficulty:"easy",solution:"Transpose exchanges rows and columns, so a 1 × 3 matrix becomes 3 × 1."},
        {question:"Find [[1,2],[3,4]] + [[5,6],[7,8]].",options:["[[6,8],[10,12]]","[[5,12],[21,32]]","[[4,4],[4,4]]","[[6,6],[10,10]]"],answer:0,difficulty:"easy",solution:"Add corresponding entries: 1+5=6, 2+6=8, 3+7=10 and 4+8=12."},
        {question:"Find [[8,6],[5,3]] − [[2,1],[4,2]].",options:["[[10,7],[9,5]]","[[6,5],[1,1]]","[[6,7],[1,5]]","[[4,5],[1,1]]"],answer:1,difficulty:"medium",solution:"Subtract corresponding entries to obtain [[6,5],[1,1]]."},
        {question:"Find 3 × [[2,−1],[0,4]].",options:["[[5,2],[3,7]]","[[6,−1],[0,12]]","[[6,−3],[0,12]]","[[6,3],[0,12]]"],answer:2,difficulty:"medium",solution:"Multiply every element by 3: [[6,−3],[0,12]]."},
        {question:"If A is 2 × 3 and B is 3 × 4, what is the order of AB?",options:["3 × 3","2 × 3","4 × 2","2 × 4"],answer:3,difficulty:"medium",solution:"The inner dimensions 3 and 3 match. The result uses the outer dimensions, so AB is 2 × 4."},
        {question:"If A=[[1,2],[3,4]] and B=[[5,6],[7,8]], what is element (1,1) of AB?",options:["19","17","23","31"],answer:0,difficulty:"medium",solution:"Take row 1 of A and column 1 of B: 1×5 + 2×7 = 19."},
        {question:"What is the transpose of [[1,2,3],[4,5,6]]?",options:["[[1,2],[3,4],[5,6]]","[[1,4],[2,5],[3,6]]","[[4,5,6],[1,2,3]]","[[1,4,2],[5,3,6]]"],answer:1,difficulty:"medium",solution:"Rows become columns, giving [[1,4],[2,5],[3,6]]."},
        {question:"Find the determinant of [[4,3],[2,5]].",options:["26","20","14","−14"],answer:2,difficulty:"medium",solution:"det(A) = 4×5 − 3×2 = 20 − 6 = 14."},
        {question:"What does determinant 0 tell us about a square matrix?",options:["It is an identity matrix","It is diagonal","It is symmetric","It is singular and has no inverse"],answer:3,difficulty:"medium",solution:"A square matrix with determinant 0 is singular, so its inverse does not exist."},
        {question:"For any compatible square matrix A, what is AI?",options:["A","I","Zero matrix","Aᵀ"],answer:0,difficulty:"medium",solution:"The identity matrix preserves a matrix under multiplication, so AI = A."},
        {question:"Which property must the adjacency matrix of a simple undirected graph have?",options:["Every value is 1","It is symmetric","Its determinant is always 1","It has one row"],answer:1,difficulty:"medium",solution:"If vertex i connects to j, then j connects to i. Thus Aᵢⱼ = Aⱼᵢ and the matrix is symmetric."},
        {question:"In a grayscale image represented as a matrix, what does each matrix element usually represent?",options:["A file name","A graph edge","A pixel intensity","A program instruction"],answer:2,difficulty:"medium",solution:"Each position corresponds to a pixel, and its numeric value records the pixel intensity."},
        {question:"Find [[1,2],[0,3]] × [[4,1],[2,5]].",options:["[[4,2],[6,15]]","[[6,11],[2,15]]","[[8,7],[6,15]]","[[8,11],[6,15]]"],answer:3,difficulty:"hard",solution:"Row-by-column products give 1×4+2×2=8, 1×1+2×5=11, 0×4+3×2=6 and 0×1+3×5=15."},
        {question:"A 3 × 2 matrix contains how many elements?",options:["6","5","8","9"],answer:0,difficulty:"hard",solution:"The number of elements is rows × columns = 3 × 2 = 6."},
        {question:"For A=[[2,1],[1,1]], what is the top-left entry of A⁻¹?",options:["1/2","1","−1","2"],answer:1,difficulty:"hard",solution:"det(A)=2×1−1×1=1. A⁻¹=[[1,−1],[−1,2]], so the top-left entry is 1."},
        {question:"If A is 2 × 3 and B is 2 × 3, which listed operation is always valid?",options:["AB","BA","A + B","A⁻¹"],answer:2,difficulty:"hard",solution:"Matrices of the same order can always be added. AB and BA are incompatible here, and a non-square matrix has no ordinary inverse."},
        {question:"For an adjacency matrix M, what does entry (i,j) of Mᵏ count in a simple graph interpretation?",options:["Only direct edges","The number of vertices","The determinant of M","Walks of length k from i to j"],answer:3,difficulty:"hard",solution:"Repeated matrix multiplication combines paths. Entry (i,j) of Mᵏ counts walks of length k from vertex i to vertex j."}
    ];
}());
