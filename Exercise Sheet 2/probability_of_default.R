library(ggplot2)

df <- data.frame(company=c("Star", "Cow", "Dog"),
                 interest_rate=c(5.20, 5.40, 9.00))
head(df)

# Basic barplot
p<-ggplot(data=df, aes(x=company, y=interest_rate)) +
  geom_bar(stat="identity", fill="steelblue")+
  geom_text(aes(label = paste0(interest_rate, "%")), vjust=1.6, size=3.5, color="white")+
  labs(
    x = "Company",
    y = "Interest Rate (%)"
  )
p

minimal_risk_for_surcharge = function(r_free, prob_default, recovery_rate) {
  (1 + r_free) * (prob_default*(1-recovery_rate))/(1-prob_default*(1-recovery_rate))
}


data1 = data.frame(company=c("Star", "Cow", "Dog"),
                  prob_default=c(0.03,0.12,7.27),
                  r_premim=c(0.02,0.09,5.00),
                  agreedinterest=c(5.20,5.40,9.00),
                  r_min=c(0,0,0),
                  npv=c(0,0,0)
                  )

r_free = 0.049
recovery_rate = 0.3945
market_rate = 5/100

for (i in 1:nrow(data1)) {
  data1$r_min[i] = minimal_risk_for_surcharge(r_free, data1$prob_default[i]/100, recovery_rate)*100
}

print(paste0("Risk for Star ", minimal_risk_for_surcharge(r_free, 0.0003, recovery_rate)*100, "%"))
print(paste0("Risk for Cow ", minimal_risk_for_surcharge(r_free, 0.0012, recovery_rate)*100, "%"))
print(paste0("Risk for Dog ", minimal_risk_for_surcharge(r_free, 0.0727, recovery_rate)*100, "%"))

npv_computal = function(today_cashflow, agreedinterest, market_rate, risk_premium) {
  today_cashflow + (abs(today_cashflow) * (1+agreedinterest))/(1+market_rate+risk_premium)
}

for (i in 1:nrow(data1)) {
  data1$npv[i] = npv_computal(-1000000, data1$agreedinterest[i]/100, market_rate, data1$r_premim[i]/100)
}
which.max
print(paste0("The company with highest NPV: ", data1$company[which.max(data1$npv)]))