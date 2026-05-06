test = matrix(c(2,5,7,
                1,3,4,
                0,8,6), nrow=3, byrow=TRUE)

test

tmp_A = matrix(c(4,0,1,5), nrow=2, byrow=TRUE)
tmp_b = c(20,30)
solve(tmp_A,tmp_b)