// YPSettings.cpp : implementation file
//

#include "stdafx.h"
#include "resource.h"
#include "YPSettings.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CYPSettings dialog


CYPSettings::CYPSettings(CWnd* pParent /*=NULL*/)
	: CDialog(CYPSettings::IDD, pParent)
{
	//{{AFX_DATA_INIT(CYPSettings)
	m_Public = FALSE;
	m_StreamDesc = _T("");
	m_StreamGenre = _T("");
	m_StreamName = _T("");
	m_StreamURL = _T("");
	m_StreamICQ = _T("");
	m_StreamIRC = _T("");
	m_StreamAIM = _T("");
	//}}AFX_DATA_INIT
}


void CYPSettings::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CYPSettings)
	DDX_Control(pDX, IDC_IRC, m_StreamIRCCtrl);
	DDX_Control(pDX, IDC_ICQ, m_StreamICQCtrl);
	DDX_Control(pDX, IDC_AIM, m_StreamAIMCtrl);
	DDX_Control(pDX, IDC_STREAMURL, m_StreamURLCtrl);
	DDX_Control(pDX, IDC_STREAMNAME, m_StreamNameCtrl);
	DDX_Control(pDX, IDC_STREAMGENRE, m_StreamGenreCtrl);
	DDX_Control(pDX, IDC_STREAMDESC, m_StreamDescCtrl);
	DDX_Check(pDX, IDC_PUBLIC, m_Public);
	DDX_Text(pDX, IDC_STREAMDESC, m_StreamDesc);
	DDX_Text(pDX, IDC_STREAMGENRE, m_StreamGenre);
	DDX_Text(pDX, IDC_STREAMNAME, m_StreamName);
	DDX_Text(pDX, IDC_STREAMURL, m_StreamURL);
	DDX_Text(pDX, IDC_ICQ, m_StreamICQ);
	DDX_Text(pDX, IDC_IRC, m_StreamIRC);
	DDX_Text(pDX, IDC_AIM, m_StreamAIM);
	//}}AFX_DATA_MAP
}


BEGIN_MESSAGE_MAP(CYPSettings, CDialog)
	//{{AFX_MSG_MAP(CYPSettings)
	ON_BN_CLICKED(IDC_PUBLIC, OnPublic)
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CYPSettings message handlers

void CYPSettings::OnPublic() 
{
    UpdateData(TRUE);
    EnableDisable();
}

void CYPSettings::EnableDisable()
{
    if (m_Public) {
        m_StreamURLCtrl.EnableWindow(TRUE);
        m_StreamNameCtrl.EnableWindow(TRUE);
        m_StreamGenreCtrl.EnableWindow(TRUE);
        m_StreamDescCtrl.EnableWindow(TRUE);
        m_StreamAIMCtrl.EnableWindow(TRUE);
        m_StreamIRCCtrl.EnableWindow(TRUE);
        m_StreamICQCtrl.EnableWindow(TRUE);
    }
    else {
        m_StreamURLCtrl.EnableWindow(FALSE);
        m_StreamNameCtrl.EnableWindow(FALSE);
        m_StreamGenreCtrl.EnableWindow(FALSE);
        m_StreamDescCtrl.EnableWindow(FALSE);
        m_StreamAIMCtrl.EnableWindow(FALSE);
        m_StreamIRCCtrl.EnableWindow(FALSE);
        m_StreamICQCtrl.EnableWindow(FALSE);
    }
}
BOOL CYPSettings::OnInitDialog() 
{
	CDialog::OnInitDialog();
	::EnableThemeDialogTexture(*this, ETDT_ENABLETAB);
	
	return TRUE;
}
