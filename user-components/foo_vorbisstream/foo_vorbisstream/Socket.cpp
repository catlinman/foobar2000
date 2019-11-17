/*

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

oddsock@oddsock.org
*/
// Socket.cpp: implementation of the CMySocket class.
//
//////////////////////////////////////////////////////////////////////

#include <stdio.h>
#include "Socket.h"

#define MAX_LEN 256

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

CMySocket::CMySocket()
{

}

CMySocket::~CMySocket()
{

}

/////////////////////////////////////////////////////////////////////////////
//
// socketErrorExit
//
// Description
//   Print supplied error message and exit the program.
//
// Parameters
//   szError - Error message text
//
void CMySocket::socketErrorExit(char *szError)
{
    printf("Socket error: %s\n", szError);
}

/////////////////////////////////////////////////////////////////////////////
//
// DoSocketListen
//
// Description
//   Code to create, bind and listen to socket; Originally from bzs@bu-cs.bu.edu
//
// Parameters
//   portnum - local port to listen for connections
//
// Return
//   Socket created on success, -1 on error.
//
#define MAXHOSTNAME 1024
SOCKET CMySocket::DoSocketListen(unsigned short portnum)
{
    char   myname[MAXHOSTNAME+1];
    SOCKET    s;
    struct sockaddr_in sa;
    struct hostent *hp;

    memset(&sa, 0, sizeof(struct sockaddr_in)); /* clear our address */
    gethostname(myname, MAXHOSTNAME);           /* who are we? */
    hp= gethostbyname(myname);                  /* get our address info */
    if (hp == NULL)                             /* we don't exist !? */
        return(-1);
    sa.sin_family= hp->h_addrtype;              /* this is our host address */
    sa.sin_port= htons(portnum);                /* this is our port number */
    if ((s= socket(AF_INET, SOCK_STREAM, 0)) < 0) /* create socket */
        return(-1);
    if (bind(s,(struct sockaddr *)&sa,sizeof(struct sockaddr_in)) < 0) {
        closesocket(s);
        return(-1);                               /* bind address to socket */
    }

    listen(s, SOMAXCONN);                               /* max # of queued connects */
    return(s);
}

/////////////////////////////////////////////////////////////////////////////
//
// DoSocketAccept
//
// Description
//   Performs an accept() on the supplied socket.
//
// Parameters
//   s - listen()'ing socket to call accept() on.
//
// Return
//   Returns the accept()'d socket on success, -1 on error.
//
SOCKET CMySocket::DoSocketAccept(SOCKET s)
{
    SOCKET t;                  /* socket of connection */
	int	namelen = 0;

    if ((t = accept(s,NULL,NULL)) < 0)   /* accept connection if there is one */
        return(-1);

/*
	memset(&connectedIP, '\000', sizeof(connectedIP));
	namelen = sizeof(connectedIP);
	int ret = getpeername(t, (struct sockaddr *)&connectedIP, &namelen);
	if (ret == SOCKET_ERROR) {
		int error = WSAGetLastError();
	}
*/
//	MessageBox(NULL, inet_ntoa(connectedIP.sin_addr), "Connected To", MB_OK);
    return(t);
}

/////////////////////////////////////////////////////////////////////////////
//
// DoSocketConnect
//
// Description
//   Performs a generic socket() and connect()
//
// Parameters
//   hostname - host to connect() to.
//   portnum - port number for connect().
//
SOCKET CMySocket::DoSocketConnect(char *hostname, unsigned short portnum)
{
	struct sockaddr_in sa;
	struct hostent     *hp;
	SOCKET s;


	if ((hp= gethostbyname(hostname)) == NULL) { /* do we know the host's */

#ifdef WIN32
		SetLastError(WSAECONNREFUSED);
#else
		fprintf(stderr, "cannot find host %s", hostname);
#endif
		return(-1);                                /* no */
	}

	memset(&sa,0,sizeof(sa));
	memcpy((char *)&sa.sin_addr,hp->h_addr,hp->h_length);     /* set address */
	sa.sin_family= hp->h_addrtype;
	sa.sin_port= htons((u_short)portnum);

	if ((s= socket(hp->h_addrtype,SOCK_STREAM,0)) < 0)     /* get socket */
		return(-1);
	
	int optval = 10000;
	setsockopt(s, SOL_SOCKET, SO_SNDTIMEO, (const char *)&optval, sizeof(optval)); 
	setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, (const char *)&optval, sizeof(optval)); 

	if (connect(s,(struct sockaddr *)&sa,sizeof sa) < 0) { /* connect */
#ifdef WIN32
		long err = WSAGetLastError();
#endif
		closesocket(s);
		return(-1);
	}
	return(s);
}

/////////////////////////////////////////////////////////////////////////////
//
// initWinsockLib
//
// Description
//   Boiler-plate Winsock setup function
//
// Parameters
//
void CMySocket::initWinsockLib(void)
{
#ifdef WIN32
	WORD wVersionRequested;
	WSADATA wsaData;
	int err;
	
	wVersionRequested = MAKEWORD( 1, 1 );
	err = WSAStartup( wVersionRequested, &wsaData );
	
	if ( err != 0 ) {
		socketErrorExit("cannot find winsock.dll");
		exit(1);
	}
	
	if ( LOBYTE( wsaData.wVersion ) != 1 ||
		HIBYTE( wsaData.wVersion ) != 1 ) {
		/* Tell the user that we couldn't find a useable */
		/* winsock.dll.                                  */
		socketErrorExit("winsock.dll is an old version");
		exit(2);
	}
#endif
}

/////////////////////////////////////////////////////////////////////////////
//
// CheckSocketError
//
// Description
//   Checks the iError input for SOCKET_ERROR, if an error exists, print
//   the supplied szMessage and exit the program
//
// Parameters
//
void CMySocket::CheckSocketError(int iError, char *szMessage)
{
	char szErrMessage[MAX_LEN];

	if (iError == SOCKET_ERROR) {
		sprintf(szErrMessage, "%s\n", szMessage);
		socketErrorExit(szErrMessage);
		return;
	}

}

