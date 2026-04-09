Sys.setenv(LANG="en") # changes logs/error messages to English
                   

print(0.1+0.2, digits=18)

if(0.1+0.2 == 0.3) {
  print("true")
} else {
  print("false")
}

# vectors are atomic data types, which means every entry in a vector has the same type
# lists are not atomic
a = c(1,2,3)
is.numeric(a[1])
is.vector(a)


print("Hello")

#a = 1
print(a)
#a = 3
print(a)

"3"==3

plot(1,3)
plot(c(1,1), c(2,3), type="l")

#d = 212712772177
#while (1) {
#  d = d + 1;
#  print(d)
#}

x <- as.integer(.Machine$integer.max)
print(paste(x, typeof(x)))

y = x + 1L
paste(y, typeof(y))

u = paste0("11111", "22222", c(2,3,4), collapse="d")

x = c(3,4,1,NA)
y = c(1,9,1,NA)
z = c(1,9,NA)

setequal(y,z)
y = unique(y)

union(x,y)
intersect(x,y)
setdiff(x,y)

for(i in 1:5) {
  print(paste0("i is ", i))
}

a=0
for(i in 1:10) {
  a = a + 2
}

j = 0
while(j < 10) {
  print(paste0("j is ", j))
  j = j + 1
}
