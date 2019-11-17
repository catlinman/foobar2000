#if !defined(AFX_YPSETTINGS_H__B411D3DE_B8D8_43E1_9B75_883D0197A7C0__INCLUDED_)
#define AFX_YPSETTINGS_H__B411D3DE_B8D8_43E1_9B75_883D0197A7C0__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// YPSettings.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// CYPSettings dialog

class CYPSettings : public CDialog
{
// Construction
public:
	CYPSettings(CWnd* pParent = NULL);   // standard constructor

    void EnableDisable();

// Dialog Data
	//{{AFX_DATA(CYPSettings)
	enum { IDD = IDD_PROPPAGE_LARGE1 };
	CEdit	m_StreamIRCCtrl;
	CEdit	m_StreamICQCtrl;
	CEdit	m_StreamAIMCtrl;
	CEdit	m_StreamURLCtrl;
	CEdit	m_StreamNameCtrl;
	CEdit	m_StreamGenreCtrl;
	CEdit	m_StreamDescCtrl;
	BOOL	m_Public;
	CString	m_StreamDesc;
	CString	m_StreamGenre;
	CString	m_StreamName;
	CString	m_StreamURL;
	CString	m_StreamICQ;
	CString	m_StreamIRC;
	CString	m_StreamAIM;
	//}}AFX_DATA


// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CYPSettings)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:

	// Generated message map functions
	//{{AFX_MSG(CYPSettings)
	afx_msg void OnPublic();
	virtual BOOL OnInitDialog();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_YPSETTINGS_H__B411D3DE_B8D8_43E1_9B75_883D0197A7C0__INCLUDED_)
