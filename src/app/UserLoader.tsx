import { useEffect } from 'react';
import { useGetProfileQuery } from '../shared/api/authApi';
import { useAppDispatch, useAppSelector } from '../shared/store/hooks';
import { setUserData } from '../shared/store/userSlice';

const UserLoader = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const { data: profile } = useGetProfileQuery(undefined, { skip: !token });

  useEffect(() => {
    if (profile) {
      dispatch(
        setUserData({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        })
      );
    }
  }, [profile, dispatch]);

  return null;
};

export default UserLoader; 