## Exercise 1

## Use a 'for' loop to sum up the numbers from 1 to 10.

sum = 0;
for(i in 1:10) {
  sum = sum + i;
}

print(sum)

## Exercise 2

for(j in 10:1) {
  print(paste("Countdown:", j))
}

## Exercise 3

factorial = 1
for(k in 1:10) {
  factorial = factorial * k;
}

print(factorial)

## Exercise 3 (a bit more optimised)

factorial = 1
for(k in 2:10) {
  factorial = factorial * k;
}

print(factorial)

## Exercise 3 OR

print(factorial(10))