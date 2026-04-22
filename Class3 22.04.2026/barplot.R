fruits = c("apple","banana","apple","orange","banana","apple")
counts = table(fruits)
barplot(counts,
        main="Fruit Count", # title of the bar chart
        ylab="Count", # name of the y-axis
        col="tomato", # color of bars
        #horiz=TRUE, #TO FLIP!
        ylim=c(0, max(counts) + 1)
)