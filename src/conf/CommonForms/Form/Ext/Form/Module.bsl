
&AtClient
Procedure OnOpenAttachIdleHandler()
	OnOpenAttachIdleHandlerAtServer();
	AttachIdleHandler("OnOpenAttachIdleHandler", 0.1, True);
EndProcedure

&AtClient
Procedure OnOpen(Cancel)
	AttachIdleHandler("OnOpenAttachIdleHandler", 0.1, True);
EndProcedure

&AtServer
Procedure OnOpenAttachIdleHandlerAtServer()	
	Data = Constants.Data.Get();
EndProcedure
