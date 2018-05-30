## webapp_phase5

Best District To Live

New York, Dataset, Neighborhood.
Neighborhood Names GIS, https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD, JSON, the_geom, borough, 299.
Crimes in NY, https://data.cityofnewyork.us/api/views/bydc-d8tj/rows.json?accessType=DOWNLOAD, JSON, BORO_NM, OFNS_DESC, Lat_lon, CMPLNT_FR_DT, 1090.
New York City housing by building data,  https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD, borough, lat, long, Extremely Low Income Units, 2917.
NY Districts geoshapes, http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson,BoroCD,geometry, 71;




In this last phase, the graph was implemented and the graphical user interface was completed.
Delivering a product ready for the user.

Map View:

[Y] Basic Map with specific location (your map is located in a meaningful place, city of west lafayette for example).

[Y] [describe] Any cover on the map . The map shows the rank of the districts according to the filter.


Data Visualization:

[Y] [describe] Use Graph? What is the type?, A pie chart was used. 

[Y] [List] Any interaction available on the graph? 
-It has the ability to update with each filter in an animated way.
-Indicate the ID of each district.

Interaction Form:

[Y] [List] Any information output? list them. 
-pie chart.
-csv file.
-markets on map.
-polygons on map.

[Y] [List] Any operation option (filters)? List them. 
- All possible combinations of filters of the three parameters.
- Export csv file according with the filter.

[Y] [List] Any information input? List them. (comments, markers, user preference ...)
-checkbox.
-select.

[Y] [List] Interaction with Map? List them. 
-All the filters will affect the markets on map.
-The select will affect the markets on map.

[Y] [List] Interaction with data visualization? List them. 
- The filter will affect the chart.
- The select will affect the chart.

Test Case
- Works correctly in Opera.
- Works correctly in Google Chrome.
- The export button does not work in Mozilla Firefox.
- The export button does not work in Microsoft Edge.

Aditional Information
-The web page takes about twenty seconds to process the information in the first filte.
