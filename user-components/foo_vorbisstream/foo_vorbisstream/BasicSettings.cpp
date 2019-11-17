// BasicSettings.cpp : implementation file
//

#include "stdafx.h"
#include "resource.h"
#include "BasicSettings.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CBasicSettings dialog


CBasicSettings::CBasicSettings(CWnd* pParent)
	: CDialog(CBasicSettings::IDD, pParent)
{
	//{{AFX_DATA_INIT(CBasicSettings)
	m_Bitrate = _T("");
	m_Channels = _T("");
	m_EncoderType = _T("");
	m_Mountpoint = _T("");
	m_Password = _T("");
	m_Quality = _T("");
	m_Samplerate = _T("");
	m_ServerIP = _T("");
	m_ServerPort = _T("");
	m_ServerType = _T("");
	m_LamePreset = _T("");
	m_UseBitrate = FALSE;
	//}}AFX_DATA_INIT
}


void CBasicSettings::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CBasicSettings)
	DDX_Control(pDX, IDC_USEBITRATE, m_UseBitrateCtrl);
	DDX_Control(pDX, IDC_QUALITY, m_QualityCtrl);
	DDX_Control(pDX, IDC_BITRATE, m_BitrateCtrl);
	DDX_Control(pDX, IDC_SERVER_TYPE, m_ServerTypeCtrl);
	DDX_Text(pDX, IDC_BITRATE, m_Bitrate);
	DDX_Text(pDX, IDC_CHANNELS, m_Channels);
	DDX_Text(pDX, IDC_MOUNTPOINT, m_Mountpoint);
	DDX_Text(pDX, IDC_PASSWORD, m_Password);
	DDX_Text(pDX, IDC_QUALITY, m_Quality);
	DDX_Text(pDX, IDC_SAMPLERATE, m_Samplerate);
	DDX_Text(pDX, IDC_SERVER_IP, m_ServerIP);
	DDX_Text(pDX, IDC_SERVER_PORT, m_ServerPort);
	DDX_CBString(pDX, IDC_SERVER_TYPE, m_ServerType);
	DDX_Check(pDX, IDC_USEBITRATE, m_UseBitrate);
	//}}AFX_DATA_MAP
}


BEGIN_MESSAGE_MAP(CBasicSettings, CDialog)
	//{{AFX_MSG_MAP(CBasicSettings)
	ON_BN_CLICKED(IDC_USEBITRATE, OnUsebitrate)
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CBasicSettings message handlers

BOOL CBasicSettings::OnInitDialog() 
{
	CDialog::OnInitDialog();
	::EnableThemeDialogTexture(*this, ETDT_ENABLETAB);
	
	// TODO: Add extra initialization here
	m_ServerTypeCtrl.AddString(_T("Icecast2"));
	m_ServerTypeCtrl.AddString(_T("Shoutcast"));

    return TRUE;  
}


void CBasicSettings::UpdateFields() {
    m_BitrateCtrl.EnableWindow(TRUE);
    m_QualityCtrl.EnableWindow(TRUE);

	m_UseBitrateCtrl.EnableWindow(TRUE);
    m_BitrateCtrl.EnableWindow(m_UseBitrate);
	m_QualityCtrl.EnableWindow(!m_UseBitrate);
}
void CBasicSettings::OnSelchangeEncoderType() 
{
	UpdateFields();
}

void CBasicSettings::OnSelendokEncoderType() 
{
	//UpdateData(TRUE);
    int selected = m_EncoderTypeCtrl.GetCurSel();
    CString  selectedString;
    m_EncoderTypeCtrl.GetLBText(m_EncoderTypeCtrl.GetCurSel(), selectedString);
    m_BitrateCtrl.EnableWindow(TRUE);
    m_QualityCtrl.EnableWindow(TRUE);
	m_EncoderType = selectedString;
	UpdateFields();

}

void CBasicSettings::OnUsebitrate() 
{
	// TODO: Add your control notification handler code here
	UpdateData(TRUE);
	UpdateFields();
}

void CBasicSettings::OnJointstereo() 
{
	// TODO: Add your control notification handler code here
	UpdateData(TRUE);
	UpdateFields();
}
