// Config.cpp : implementation file
//

#include "stdafx.h"
#include "resource.h"
#include "Config.h"
#include <tchar.h>

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif


CConfig::CConfig(dsp_preset_edit_callback & p_callback,CWnd* pParent /*=NULL*/)
	: CDialog(CConfig::IDD, pParent), m_callback(p_callback)
{
	//{{AFX_DATA_INIT(CConfig)
		// NOTE: the ClassWizard will add member initialization here
	//}}AFX_DATA_INIT

    basicSettings = new CBasicSettings();
    ypSettings = new CYPSettings();
    currentEnc = 0;
}

CConfig::~CConfig()
{
    if (basicSettings) {
        delete basicSettings;
    }
    if (ypSettings) {
        delete ypSettings;
    }
}
void CConfig::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CConfig)
	DDX_Control(pDX, IDC_TAB1, m_TabCtrl);
	//}}AFX_DATA_MAP
}


BEGIN_MESSAGE_MAP(CConfig, CDialog)
	//{{AFX_MSG_MAP(CConfig)
	ON_NOTIFY(TCN_SELCHANGE, IDC_TAB1, OnSelchangeTab1)
	ON_WM_CLOSE()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CConfig message handlers

BOOL CConfig::OnInitDialog() 
{
	CDialog::OnInitDialog();
	
	// TODO: Add extra initialization here
	m_TabCtrl.InsertItem(0, _T("Basic Settings"));
	m_TabCtrl.InsertItem(1, _T("YP Settings"));

    basicSettings->Create((UINT)IDD_PROPPAGE_LARGE, this);    
    ypSettings->Create((UINT)IDD_PROPPAGE_LARGE1, this);    

	{
		CRect rc;
		m_TabCtrl.GetWindowRect(&rc);
		ScreenToClient(&rc);
		m_TabCtrl.AdjustRect(FALSE, &rc);
		basicSettings->SetWindowPos(NULL, rc.left, rc.top, rc.Width(), rc.Height(), SWP_NOZORDER | SWP_NOACTIVATE | SWP_NOREDRAW);
		ypSettings->SetWindowPos(NULL, rc.left, rc.top, rc.Width(), rc.Height(), SWP_NOZORDER | SWP_NOACTIVATE | SWP_NOREDRAW);
	}
    basicSettings->ShowWindow(SW_SHOW);
    ypSettings->ShowWindow(SW_HIDE);


	GlobalsToDialog(globals);

	return TRUE;  
}

void CConfig::OnSelchangeTab1(NMHDR* pNMHDR, LRESULT* pResult) 
{
	int selected = m_TabCtrl.GetCurSel();
    if (selected == 0) {
        basicSettings->ShowWindow(SW_SHOW);
        ypSettings->ShowWindow(SW_HIDE);
    }
    if (selected == 1) {
        ypSettings->ShowWindow(SW_SHOW);
        basicSettings->ShowWindow(SW_HIDE);
    }

	*pResult = 0;
}
void CConfig::GlobalsToDialog(edcastGlobals *g) {
    char    buf[255] = "";

    currentEnc = g->encoderNumber;
	sprintf(buf, "%d", getCurrentBitrate(g));
    basicSettings->m_Bitrate = buf;
    sprintf(buf, "%d", getCurrentChannels(g));
    basicSettings->m_Channels = buf;
    sprintf(buf, "%d", getCurrentSamplerate(g));
    basicSettings->m_Samplerate = buf;
	
	basicSettings->m_UseBitrate=(g->gOggBitQualFlag!=0);
	basicSettings->m_EncoderType = "OggVorbis";
	basicSettings->m_Quality = g->gOggQuality;
    basicSettings->m_Mountpoint = g->gMountpoint;
    basicSettings->m_Password = g->gPassword;
    basicSettings->m_ServerIP = g->gServer;
    basicSettings->m_ServerPort = g->gPort;
	basicSettings->m_ServerType = (g->gShoutcastFlag)?"Shoutcast":"Icecast2";
	basicSettings->m_ServerTypeCtrl.SelectString(0, basicSettings->m_ServerType);
    basicSettings->UpdateData(FALSE);
    basicSettings->UpdateFields();

	ypSettings->m_Public=g->gPubServ;
	ypSettings->m_StreamDesc = g->gServDesc;
    ypSettings->m_StreamName = g->gServName;
    ypSettings->m_StreamGenre = g->gServGenre;
    ypSettings->m_StreamURL = g->gServURL;
    ypSettings->m_StreamAIM = g->gServAIM;
    ypSettings->m_StreamICQ = g->gServICQ;
    ypSettings->m_StreamIRC = g->gServIRC;
    ypSettings->UpdateData(FALSE);
    ypSettings->EnableDisable();
}

// Workaround for clowns doing unchecked strcpy and mixing CString with char*
template<unsigned outWidth> static void myStrCpyHack(char (&out)[outWidth], const TCHAR * in) {
	for(unsigned outWalk = 0; ; ) {
		TCHAR c;
		if (outWalk + 1 == outWidth) c = 0; // don't write past outWidth
		else c = *in++;
		if ((unsigned)c > 0x7F) c = '?';
		out[outWalk++] = (char)c;
		if (c == 0) break;
	}
}

void CConfig::DialogToGlobals(edcastGlobals *g) {
    
    currentEnc = g->encoderNumber;

    g->currentBitrate = _ttoi(basicSettings->m_Bitrate);
    g->currentChannels = _ttoi(basicSettings->m_Channels);
    g->currentSamplerate = _ttoi(basicSettings->m_Samplerate);

	g->gOggBitQualFlag=(basicSettings->m_UseBitrate)?1:0;

    myStrCpyHack(g->gEncodeType, basicSettings->m_EncoderType);
    myStrCpyHack(g->gOggQuality, basicSettings->m_Quality);
    myStrCpyHack(g->gMountpoint, basicSettings->m_Mountpoint);
    myStrCpyHack(g->gPassword, basicSettings->m_Password);
    myStrCpyHack(g->gServer, basicSettings->m_ServerIP);
    myStrCpyHack(g->gPort, basicSettings->m_ServerPort);

    if (basicSettings->m_ServerType == "Shoutcast") {
        g->gShoutcastFlag = 1;
        g->gIcecast2Flag = 0;
    }
    if (basicSettings->m_ServerType == "Icecast2") {
        g->gShoutcastFlag = 0;
        g->gIcecast2Flag = 1;
    }
    myStrCpyHack(g->gServerType, basicSettings->m_ServerType);

    ypSettings->UpdateData(TRUE);
	
	g->gPubServ=(ypSettings->m_Public)?1:0;
    myStrCpyHack(g->gServDesc, ypSettings->m_StreamDesc);
    myStrCpyHack(g->gServName, ypSettings->m_StreamName);
    myStrCpyHack(g->gServGenre, ypSettings->m_StreamGenre);
    myStrCpyHack(g->gServURL, ypSettings->m_StreamURL);
    myStrCpyHack(g->gServAIM, ypSettings->m_StreamAIM);
    myStrCpyHack(g->gServICQ, ypSettings->m_StreamICQ);
    myStrCpyHack(g->gServIRC, ypSettings->m_StreamIRC);
}

void CConfig::OnClose() 
{
    CDialog::OnClose();
}

void CConfig::OnOK() 
{
	basicSettings->UpdateData(TRUE);
	ypSettings->UpdateData(TRUE);

	pfc::ptrholder_t<edcastGlobals> l_globals = new edcastGlobals; // could just do "edcastGlobals l_globals;" but it's huge and ugly to put on stack
	DialogToGlobals(&*l_globals);
	dsp_preset_impl preout;
	preout.set_owner(data_owner);
	preout.set_data(&*l_globals,sizeof(edcastGlobals));
	
	m_callback.on_preset_changed(preout);
    CDialog::OnOK();
}

void CConfig::OnCancel() 
{
    CDialog::OnCancel();
}
