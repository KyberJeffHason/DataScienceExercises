# Examples of functions
# Function let you create your own function that you can use, with one line, for example
# print is a function, paste is a function. You just make your own

summation = function(x) {
  sum = 0;
  
  for(i in 1:x) {
    sum = sum + i;
  }
  
  return(sum)
}

print(summation(25))

plus = function(a,b) {
  return(a+b)
}

print(plus(1,1))