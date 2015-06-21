#Android密码框显示或隐藏密码

```
public class LoginFragment extends Fragment implements View.OnClickListener, CompoundButton.OnCheckedChangeListener{

    protected EditText      mLoginnameText;
    protected EditText      mPassText;
    protected Button        mLoginBtn;
    protected CheckBox      mShowPassCheck;

    public LoginFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        setHasOptionsMenu(true);
        View rootView       = inflater.inflate(R.layout.fragment_login, container, false);
        mLoginnameText      = (EditText) rootView.findViewById(R.id.loginnameText);
        mPassText           = (EditText) rootView.findViewById(R.id.passText);
        mLoginBtn           = (Button) rootView.findViewById(R.id.loginCheck);
        mShowPassCheck      = (CheckBox) rootView.findViewById(R.id.showPassBtn);
        mLoginBtn.setOnClickListener(this);
        mShowPassCheck.setOnCheckedChangeListener(this);
        return rootView;
    }

	...其他代码

    @Override
    public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
        if (b) {
            mPassText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
        } else {
            mPassText.setTransformationMethod(PasswordTransformationMethod.getInstance());
        }
    }
}
```