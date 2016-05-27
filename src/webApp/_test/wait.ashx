<%@ WebHandler Language="C#" Class="wait" %>

using System;
using System.Web;

public class wait : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/javascript";
        System.Threading.Thread.Sleep(int.Parse(context.Request.QueryString["t"] ?? "6") * 1000);
        context.Response.Write("trace(" + context.Request.QueryString["p"] + ")");
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}