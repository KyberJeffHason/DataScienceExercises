# First linear equation
A = matrix(
  c(1, 1, 
    2, 1), 
  nrow = 2,   
  ncol = 2,         
  byrow = TRUE          
)

b = c(5,8)
print(A)
print(b)
solve(A,b)

# 2nd linear equation
A = matrix(
  c(4, 0, 
    1, 5), 
  nrow = 2,   
  ncol = 2,         
  byrow = TRUE          
)

b = c(20,30)
print(A)
print(b)
solve(A,b)

# 3rd linear equation
A = matrix(
  c(2, 1, 
    1, -1), 
  nrow = 2,   
  ncol = 2,         
  byrow = TRUE          
)

b = c(6,1)
print(A)
print(b)
solve(A,b)