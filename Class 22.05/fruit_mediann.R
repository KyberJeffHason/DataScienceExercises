library(dplyr)

df = read.csv("fruits_fix.csv", header=TRUE)

new_data = df %>%
  group_by(type) %>%
  summarise(mean_weight = mean(weight),
            mean_height = mean(height),
            mean_width = mean(width),
            sample_size = n())

new_data

barplot(new_data$mean_height,
        names.arg= new_data$type,
        main="Mean height per fruit type", # title of the bar chart
        xlab="types of fruit",#title of x-axis
        ylab="Mean value", # name of the y-axis
        col=c("green","yellow","orange"), # color of bars in order
        ylim=c(0, max(new_data$mean_height) + max(new_data$mean_height)*0.25)
)