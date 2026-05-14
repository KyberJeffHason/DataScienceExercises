check_two <- function(x) {
  return(x %% 2 == 0)
}

print(check_two(2))
print(check_two(5))
print(check_two(6))

check_two2 <- function(x) {
  if (x %% 2 == 0) {
    print(paste("Number", x, "is divisible by 2"))
  } else {
    print(paste("Number", x, "is NOT divisible by 2"))
  }
}

print(check_two2(3))