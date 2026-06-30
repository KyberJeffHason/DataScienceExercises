library(dplyr)

df = read.csv("fruits_fix.csv", header=TRUE)

new_data = df %>%
  group_by(type) %>% # Separate the rows by unique values in the type column.
  #For each group, calculate the median of the weight column.
  #Call the result median_value.
  summarise(median_value = median(weight))

new_data

barplot(new_data$median_value,
        names.arg= new_data$type,
        main="Median weight per fruit type", # title of the bar chart
        ylab="Median value", # name of the y-axis
        col="steelblue", # color of bars
        ylim=c(0, max(new_data$median_value) + max(new_data$median_value)*0.25)
)