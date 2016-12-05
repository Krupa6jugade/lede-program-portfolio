
# Idea

Going to the US over summer, I was overwhelmed by the heat in New York City. Everyone at home I told that even at night temperature doesn't drop below 28 degrees Celsius would sweat with me in thoughts. "It's at the same latitude as Rome", I would say as an explanation. That yielded surprise with all my conversation partners.

Idea was born: What if you'd show the position of cities to one another, leaving out the longitude to make it comparable more easily?

While I had this idea when I didn't know how to code yet, someone else did it: My secret idol Lisa Rost had the same idea and [tweeted a statitc graphic version](https://twitter.com/lisacrost/status/745731918214344704) and upon receiving lots of feedback also did an improved chart and compiled [several interactives](http://lisacharlotterost.github.io/2016/06/23/flatland/).

Nonetheless, I'd like to try it on my own!

# Process

## Pseudocode
draw rectangles for each continent
draw lines for each city
	x determined by continent affiliation
	y determined by latitude

label cities

upon mouseover over a city line
	? show tooltip with population?
	? highlight those in other continents who are on the same range

dataset required: city, latitude, continent
second dataset: continents, northern lat, southern lat
prepwork: come up with ranges!

## Design choices
Font: Raleway
Colors:
* Purple Navy: #404e7c
* Sunset Orange: #fe5f55
* Turquoise: #4ce0d2
* Continents -- Sandstorm: #e8d245
* Background -- Soap: #c6caed

## Getting the data

##
