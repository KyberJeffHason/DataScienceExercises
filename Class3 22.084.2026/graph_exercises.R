seq1 = seq(-10,10)
seq2 = c(-3,-2,-1,0,1,2,3)
seq3 = c(-5,-4,-3,-2,-1,1,2,3,4,5)

func1 = function(x) {
  return(x^2)
}

func2 = function(x) {
  return(1/x)
}

plot(seq1,func1(seq1), type="l")
plot(seq2,func1(seq2), type="p")
plot(seq3,func2(seq3), type="p")

# 1 and 3 together

plot(seq1,func1(seq1), type="l", col="red", xlim=c(-10, 10), ylim=c(0, 100))
points(seq3,func2(seq3), type="p", col="blue")