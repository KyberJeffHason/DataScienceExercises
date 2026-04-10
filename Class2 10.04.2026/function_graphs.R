Sys.setenv(LANG="en") # changes logs/error messages to English
x = seq(-10,10,.2)
# Ex 1
a = function(x) {
  return(3*x+5)
}


plot(x,a(x))

# Exercise 2
b = function(x) {
  return(-2*x+7)
}


plot(x,b(x))

# Exercise 3

f = function(x) {
  return((3*x-4)/2)
}


plot(x,f(x))

# Plot all together

plot(x,a(x), ylim=c(-10,10), xlim=c(-10,10))
points(x, b(x), col="red")
points(x, f(x), col="blue")

# Exercise Convert

mobileRateScalar = function (d) {
  if (d <= 25) {
    return(9)
  } else {
    return(9+3*(ceiling(d-25)))
  }
}

mobileRate = Vectorize(mobileRateScalar)


x = c(seq(0,25), seq(25,35,0.2))
plot(x,mobileRate(x), type="s", xlab="GB", ylab="Price in EUR")