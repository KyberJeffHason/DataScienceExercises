library(tidyverse) # Load Library

df = read.csv("eu_population.csv", check.names = FALSE) #load csv into df variable, without changing anything
 
df_tidy = df %>%
  pivot_longer(
    cols = !Country,
    names_to = "Year",
    values_to = "Population"
  )

# Take df and send it(pipe it) into the function pivot longer
# Takes all columns except Country and turn them into rows
# old columns will go into a new column named Year
# the numbers inside those columns will go to a new column Population

df_tidy %>%
  filter ( Year == max(Year) ) %>%
  arrange ( desc(Population)) %>%
  slice_head ( n = 6 )

# Show first 6 rows, sorted in descending order of the maximum year

df_tidy %>%
  filter ( Country == "France" | Country == "Poland") %>%
  filter ( between(as.numeric(Year), 2018, 2020) ) %>%
  arrange ( desc(Year))
# Shows information about France and Poland in range 2018-2020, sorted by year in descending order
