function map_point(P,Q,A,B,X){
    var x;
    if (typeof P == "number" && typeof Q == "number" && typeof X == "number"){
        x = (X-P)/(Q-P);
    }
    else {
        x = length(subtract(X,P)) / length(subtract(Q,P))
    }

    const mappedPoint = mix(A,B,x)

    return mappedPoint
}