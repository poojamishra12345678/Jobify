let matrix=[
    [23,43,54],[12,87,45],[78,45,23]
]


let sum=matrix.reduce((acc,cur)=>acc+cur.reduce((ac,cr)=>ac+cr,0),0);



console.log(sum)