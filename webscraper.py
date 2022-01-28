#Imports all neccessary libraries
from bs4 import BeautifulSoup
import requests
import csv


# SOURCE URL IS THE ONLY THING YOU CHANGE!!!                                                                              
source = requests.get('https://www.gov.ie/en/press-release/65b39-statement-from-the-national-public-health-emergency-team-sunday-17-january/')
src = source.content                                                                                                     
soup = BeautifulSoup(src, 'lxml')

#Only bit of Beautiful Soup we use. The rest is Python
table = soup.find('table', class_='table')
table = list(table)

# puts all data into a list
good_input = [] 
for line in table:
    line = str(line)

    if len(line.strip()) == 0:
            continue

    good_input.append(line)

# Isolate column headings
header = good_input.pop(0)
header = header.split('\n')
header = [
    header[1][ header[1].find('C') : header[1].find('y')+1 ],
    header[3][ header[3].find('T') : header[3].find('(')-1 ],
    header[7][ header[7].find('N') : header[7].find('(')-1 ]
    ]
    
# Isolate Ireland row
ireland = good_input.pop(0)
ireland = ireland.split('\n')
ireland = [
    ireland[1][ ireland[1].find('I') : ireland[1].find('/')-1 ], 
    ireland[3][ ireland[3].find('"')+3 : ireland[3].find('/')-1 ],
    ireland[7][ ireland[7].find('"')+3 : ireland[7].find('/')-1 ]
    ]

ireland[-1] = int(ireland[-1].replace(',', ''))

#Takes the rest of data and extracts only the text.
def data(table):
    myList = []
    for line in table:
        line = str(line)

        if len(line.strip()) == 0:
            continue

        tokens = line.split('\n')
        county = tokens[1][4:-5]
        daily = (tokens[2][4:-5]).rstrip('\n')
        two_week_cases = tokens[4][4:-5]
        myList.append([county, daily, two_week_cases])
    
    return myList


myList = data(good_input)

#Writes the data to a csv file.
with open('test.csv', 'w', newline='') as f:
    wr = csv.writer(f)
    wr.writerow(header)
    wr.writerow(ireland)
    for data in myList:
        wr.writerow(data)

