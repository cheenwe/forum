Rails.application.routes.draw do  
  root to: 'pages#stats'

  get '/pos' => 'pages#pos'
  get '/wallets' => 'pages#wallets'
  get '/explorer' => 'pages#explorer'
  get '/trade' => 'pages#trade'
  get '/downloads' => 'pages#downloads'
  get '/news' => 'pages#news'

  scope path: 'admin' do
    authenticate :user, lambda { |u| u.admin? } do
      mount RailsEmailPreview::Engine, at: 'emails'
    end
  end
  
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, only: [:show]
  mount Thredded::Engine => '/forum'
end
