# First linear equation
A = matrix(
  c(4, 2, 
    1, 1), 
  nrow = 2,   
  ncol = 2,         
  byrow = TRUE          
)

b = c(5,8)
print(A)
solve(A,b)

# 2nd linear equation

A = matrix(
c(1, 1, 1,
  2,-1,1,
  1,2,-1), 
nrow = 3,   
ncol = 3,         
byrow = TRUE          
)

b = c(6,3,2)
print(A)
print(b)
solve(A,b)

# 3rd linear equation

A = matrix(
  c(1, 1, 1, 1,
    2, -1, 1, 2,
    1, 2, -1, 1,
    3, 1, 2, -1), 
  nrow = 4,   
  ncol = 4,         
  byrow = TRUE          
)

b = c(10,11,6,7)
print(A)
print(b)
solve(A,b)
