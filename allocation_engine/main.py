import pandas as pd
data = pd.read_csv('./Resume/resume.csv')
data_new = data[['Resume_str','Category']]
data_new.to_csv('./resume.csv',index=False)