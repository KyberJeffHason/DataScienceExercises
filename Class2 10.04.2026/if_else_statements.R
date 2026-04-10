Sys.setenv(LANG="en") # changes logs/error messages to English

y=0

if(y>4) {
  print("bigger than 4")
} else if(y==4) {
  print("y is 4")
} else {
  print("y smaller than 4")
}

# Exercise 1 - check for positive, negative, 0

if(y>0) {
  print("y is positive")
} else if(y<0) {
  print("y is negative")
} else {
  print("y is zero")
}