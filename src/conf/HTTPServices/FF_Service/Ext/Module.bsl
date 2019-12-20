
Function CoordinatePost(Request)
	Response = New HTTPServiceResponse(200);
	Text = Request.GetBodyAsString();
	Constants.Data.Set(Text);
	JSON = New JSONReader;
	JSON.SetString(Text);
	Data = ReadJSON(JSON, False);
	JSON.Close();
	
	StrData = "ID: %1; xPos: %2; yPos: %3";
	StrData = StrTemplate(StrData, Data.id, Data.currentCoordinates.x, Data.currentCoordinates.y);
	
	Response.SetBodyFromString("<span style = 'background-color: #99FFCCAA;'><span style = 'font-size: 100%;'>" + StrData + "</span></span>");
	
	Return Response;
EndFunction

Function drawPageGet(Request)
	Response = New HTTPServiceResponse(200);
	Return Response;
EndFunction
