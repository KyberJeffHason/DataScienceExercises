# - was using some wrong symbol
# the second vector v2, didn't have the third member
# so 3 didn't have anything valid to add to, and it just became
# last valid member 7

v1 <- c ( 1 , 2 , 3 )
v2 <- c ( 4 , 5, 6 )
v1 + v2

# Same with symbols(probably just pasting)
# <- used for setting the variable
# use == for comparison
y <- "a"
if ( y == 3 ) {
  print ( "y is 3" )
}

# This one had a misspelled variable in print

add_two <- function ( x ) {
  x + 2
}
result <- add_two ( 3 )
print( result )
