df <- data.frame(Fondsname=c("Fonds A", "Fonds B", "Fonds C", "Fonds D", "Fonds E"),
                 year_1=c(100,100,100,100,100),
                 year_2=c(120,101,95,95,105),
                 year_3=c(100,102,101,105,101))

percentage_change = function(present,future) {
  result = round(abs(1 - future/present) * 100, digits = 2)
  if (future > present) {
    return(result)
  } else {
    return(result * -1)
  }
}

df$change_1to2 = mapply(percentage_change, df$year_1, df$year_2)
df$change_2to3 = mapply(percentage_change, df$year_2, df$year_3)

format_percentage = function(perc) {
  if (perc > 0) {
    return(1 + perc/100)
  } else {
    return(1 - abs(perc/100))
  }
}

geom_growth = function(perc1, perc2) {
  ac_perc1 = format_percentage(perc1)
  ac_perc2 = format_percentage(perc2)
  return(format(sqrt(ac_perc1 * ac_perc2), digits=4))
}


df$geom_growth = mapply(geom_growth, df$change_1to2, df$change_2to3)
colors = c("red", "blue", "steelblue", "green", "orange")
used_sequence = seq(1,3,1)

plot(used_sequence, df[1, c("year_1", "year_2", "year_3")], type="l", col=colors[1], xlab="Year", ylab="Value", xaxt = "n", ylim=c(95,120))
axis(1, at = used_sequence, labels = c("Year1", "Year2", "Year3"))
i = 2
while(i < length(df$Fondsname) + 1) {
  points(used_sequence, df[i, c("year_1", "year_2", "year_3")], type="l", col=colors[i])
  i = i + 1
}