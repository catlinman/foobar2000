#if !defined(AFX_CONFIG_H__45134EFE_9919_4427_8C2A_A264B88E6AA5__INCLUDED_)
#define AFX_CONFIG_H__45134EFE_9919_4427_8C2A_A264B88E6AA5__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// Config.h : header file
//
#include <afxcmn.h>
#include "BasicSettings.h"
#include "YPSettings.h"
#include "Edcast.h"
#include "../SDK/foobar2000.h"

/////////////////////////////////////////////////////////////////////////////
// CConfig dialog

class CConfig : public CDialog
{
// Construction
public:
	CConfig(dsp_preset_edit_callback&,CWnd* pParent = NULL);   // standard constructor
	CConfig(CWnd* pParent = NULL);   // standard constructor
    ~CConfig();

    void GlobalsToDialog(edcastGlobals *g);
    void DialogToGlobals(edcastGlobals *g);
// Dialog Data
	//{{AFX_DATA(CConfig)
	enum { IDD = IDD_CONFIG };
	CTabCtrl	m_TabCtrl;
	//}}AFX_DATA


    CBasicSettings  *basicSettings;
    CYPSettings     *ypSettings;
    CDialog *parentDialog;
    int     currentEnc;
	dsp_preset_edit_callback & m_callback;
	edcastGlobals* globals;
	GUID data_owner;

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CConfig)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:

	// Generated message map functions
	//{{AFX_MSG(CConfig)
	virtual BOOL OnInitDialog();
	afx_msg void OnSelchangeTab1(NMHDR* pNMHDR, LRESULT* pResult);
	afx_msg void OnClose();
	virtual void OnOK();
	virtual void OnCancel();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_CONFIG_H__45134EFE_9919_4427_8C2A_A264B88E6AA5__INCLUDED_)
