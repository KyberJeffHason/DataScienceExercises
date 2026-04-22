seq1 = seq(-10,10)
seq2 = seq(-10,10, .2)

func1 = function(x) {
  return(3*x^2+5)
}

func2 = function(x) {
  return(-x+20)
}

plot(seq1,func1(seq1), type="l")
plot(seq2,func1(seq2), type="p", col="blue")
plot(seq2,func2(seq2), type="p", col="red")

# 1 and 3 together

plot(seq1,func1(seq1), type="l")
points(seq2,func2(seq2), type="p", col="red")