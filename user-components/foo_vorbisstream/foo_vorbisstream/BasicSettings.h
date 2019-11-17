#if !defined(AFX_BASICSETTINGS_H__CE353873_E79C_4F73_A2B1_E59DC21EB423__INCLUDED_)
#define AFX_BASICSETTINGS_H__CE353873_E79C_4F73_A2B1_E59DC21EB423__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// BasicSettings.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// CBasicSettings dialog

class CBasicSettings : public CDialog
{
// Construction
public:
	CBasicSettings(CWnd* pParent = NULL);   // standard constructor

// Dialog Data
	//{{AFX_DATA(CBasicSettings)
	enum { IDD = IDD_PROPPAGE_LARGE };
	CButton	m_JointStereoCtrl;
	CButton	m_UseBitrateCtrl;
	CEdit	m_QualityCtrl;
	CEdit	m_BitrateCtrl;
	CComboBox	m_ServerTypeCtrl;
	CComboBox	m_EncoderTypeCtrl;
	CString	m_Bitrate;
	CString	m_Channels;
	CString	m_EncoderType;
	CString	m_Mountpoint;
	CString	m_Password;
	CString	m_Quality;
	CString	m_ReconnectSecs;
	CString	m_Samplerate;
	CString	m_ServerIP;
	CString	m_ServerPort;
	CString	m_ServerType;
	CString	m_LamePreset;
	BOOL	m_UseBitrate;
	BOOL	m_JointStereo;
	//}}AFX_DATA

    void UpdateFields();
// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CBasicSettings)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:

	// Generated message map functions
	//{{AFX_MSG(CBasicSettings)
	virtual BOOL OnInitDialog();
	afx_msg void OnSelchangeEncoderType();
	afx_msg void OnSelendokEncoderType();
	afx_msg void OnUsebitrate();
	afx_msg void OnJointstereo();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_BASICSETTINGS_H__CE353873_E79C_4F73_A2B1_E59DC21EB423__INCLUDED_)
