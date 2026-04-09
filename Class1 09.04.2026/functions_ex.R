summation = function(x) {
  sum = 0;
  
  for(i in 1:x) {
    sum = sum + i;
  }
  
  return(sum)
}

print(summation(25))

countdown = function(x) {
  for(j in x:1) {
    print(paste("Countdown:", j))
  }
}

countdown(15)

customFactorial = function(x) {
  factorial = 1
  for(k in 2:x) {
    factorial = factorial * k;
  }
  
  return(factorial)
}

print(customFactorial(6))