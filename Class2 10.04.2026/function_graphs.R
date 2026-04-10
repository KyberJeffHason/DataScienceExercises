Sys.setenv(LANG="en") # changes logs/error messages to English
x = seq(-10,10,.2)
# Ex 1
f = function(x) {
  return(3*x+5)
}


plot(x,a(x))

# Exercise 2
g = function(x) {
  return(-2*x+7)
}


plot(x,b(x))

# Exercise 3

h = function(x) {
  return((3*x-4)/2)
}


plot(x,f(x))

# Plot all together

plot(x,f(x), ylim=c(-10,10), xlim=c(-10,10))
points(x, g(x), col="red")
points(x, h(x), col="blue")

# Exercise Convert #1

doubleInput = function(x) {
  return(2*x);
}
plot(x,doubleInput(x))
print(doubleInput(7))

# Exercise Convert #2

multiplyAndAdd = function(x) {
  return(3*x+4)
}

plot(x,multiplyAndAdd(x))
print(multiplyAndAdd(9))

# Exercise Convert #3

conditionalFunc = function(x) {
  if (x < 2) {
    return(2*x)
  } else {
    return(4)
  }
}
# If else doesn't work with vectors
# One method to do it
conditionalFuncVector = Vectorize(conditionalFunc)
plot(x,conditionalFuncVector(x))

# Second method to do it
plot(x, sapply(x,conditionalFunc))

print(conditionalFunc(1.5))
print(conditionalFunc(6))

## Plot Everything

plot(x,doubleInput(x), ylim=c(-10,10), xlim=c(-10,10))
points(x, multiplyAndAdd(x), col="red")
points(x, sapply(x,conditionalFunc), col="blue")

# Exercise Convert #4

mobileRateScalar = function (d) {
  if (d <= 25) {
    return(9)
  } else {
    return(9+3*(ceiling(d-25)))
  }
}

mobileRate = Vectorize(mobileRateScalar)


xx = c(seq(0,25), seq(25,35,0.2))
plot(xx,mobileRate(xx), type="s", xlab="GB", ylab="Price in EUR")