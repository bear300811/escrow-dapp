import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import './App.css' // CSS 파일 연결!

// Pinata 가입 후 프로필 -> API Keys에서 발급받은 JWT 토큰을 입력합니다.
const PINATA_JWT = 'YOUR_PINATA_JWT_TOKEN_HERE'

// (uploadToIPFS 함수는 기존 코드와 동일)
const uploadToIPFS = async (file, name) => {
  if (!file) return `QmFakeCID_${name}_${new Date().getTime()}`
  try {
    console.log('실제 IPFS(Pinata)에 파일 업로드 중...')
    const formData = new FormData()
    formData.append('file', file)
    const metadata = JSON.stringify({ name: `${name}_${new Date().getTime()}` })
    formData.append('pinataMetadata', metadata)
    const options = JSON.stringify({ cidVersion: 0 })
    formData.append('pinataOptions', options)

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      },
    )
    const ipfsHash = response.data.IpfsHash
    console.log('IPFS 업로드 성공! CID:', ipfsHash)
    return `${ipfsHash}_${name}`
  } catch (error) {
    console.error('Pinata IPFS 업로드 실패:', error)
    throw new Error('IPFS 업로드에 실패했습니다.')
  }
}

const CONTRACT_ADDRESS = '0x15199824188fCC02725c2dC3c32eF3eFF4b2DC63'

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'DisputeRaised',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string',
      },
    ],
    name: 'ItemCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
    ],
    name: 'ItemDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newIpfsHash',
        type: 'string',
      },
    ],
    name: 'ItemUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PaymentDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'itemId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'PaymentReleased',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AUTO_CONFIRM_TIME',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'autoConfirm',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'confirmReceipt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_ipfsHash',
        type: 'string',
      },
    ],
    name: 'createItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'deleteItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_newPrice',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_newIpfsHash',
        type: 'string',
      },
    ],
    name: 'editItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'itemCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'items',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address payable',
        name: 'seller',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'buyer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'lockedTime',
        type: 'uint256',
      },
      {
        internalType: 'enum AdvancedEscrow.State',
        name: 'state',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_itemId',
        type: 'uint256',
      },
    ],
    name: 'raiseDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const STATUS_LABELS = ['판매중', '예치완료', '거래완료', '삭제됨', '분쟁중']

export default function App() {
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState(null)
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageFile: null,
  })

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await web3Provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)

        const escrowContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        )
        setContract(escrowContract)
        fetchItems(escrowContract)
      } else {
        alert('메타마스크를 설치해주세요!')
      }
    }
    init()
  }, [])

  const fetchItems = async (escrowContract) => {
    try {
      const count = await escrowContract.itemCount()
      const fetchedProducts = []
      for (let i = 1; i <= count; i++) {
        const item = await escrowContract.items(i)
        if (Number(item.state) !== 3) {
          const parts = item.ipfsHash.split('_')
          const productName = parts.length > 1 ? parts[1] : '알 수 없는 상품'
          fetchedProducts.push({
            id: Number(item.id),
            name: productName,
            seller: item.seller,
            buyer: item.buyer,
            price: ethers.formatEther(item.price),
            ipfsHash: item.ipfsHash,
            state: Number(item.state),
            lockedTime: Number(item.lockedTime),
          })
        }
      }
      setProducts(fetchedProducts.reverse())
    } catch (err) {
      console.error('데이터 로드 실패:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price)
      return alert('필수 항목을 입력해주세요.')
    try {
      const ipfsHash = await uploadToIPFS(formData.imageFile, formData.name)
      const priceInWei = ethers.parseEther(formData.price)

      if (editingId) {
        const tx = await contract.editItem(editingId, priceInWei, ipfsHash)
        await tx.wait()
        alert('상품이 수정되었습니다.')
      } else {
        const tx = await contract.createItem(priceInWei, ipfsHash)
        await tx.wait()
        alert('스마트 컨트랙트에 상품이 등록되었습니다.')
      }
      closeModal()
      fetchItems(contract)
    } catch (err) {
      console.error(err)
      alert('트랜잭션 실패')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      const tx = await contract.deleteItem(id)
      await tx.wait()
      fetchItems(contract)
    } catch (err) {
      alert('삭제 실패')
    }
  }

  const handleDeposit = async (id, price) => {
    try {
      const priceInWei = ethers.parseEther(price.toString())
      const tx = await contract.deposit(id, { value: priceInWei })
      await tx.wait()
      fetchItems(contract)
    } catch (err) {
      alert('예치 실패')
    }
  }

  const handleConfirm = async (id) => {
    try {
      const tx = await contract.confirmReceipt(id)
      await tx.wait()
      fetchItems(contract)
    } catch (err) {
      alert('확정 실패')
    }
  }

  const handleAutoConfirm = async (id) => {
    try {
      const tx = await contract.autoConfirm(id)
      await tx.wait()
      fetchItems(contract)
    } catch (err) {
      alert('자동 확정 실패')
    }
  }

  const handleDispute = async (id) => {
    if (!window.confirm('분쟁 상태로 전환하시겠습니까?')) return
    try {
      const tx = await contract.raiseDispute(id)
      await tx.wait()
      fetchItems(contract)
    } catch (err) {
      alert('이의 제기 실패')
    }
  }

  const openEditModal = (product) => {
    setEditingId(product.id)
    setFormData({ name: product.name, price: product.price, imageFile: null })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({ name: '', price: '', imageFile: null })
  }

  // 상태값에 따른 배지 색상 클래스 반환
  const getStatusClass = (state) => {
    if (state === 0) return 'status-0'
    if (state === 1) return 'status-1'
    if (state === 4) return 'status-4'
    return 'status-default'
  }

  return (
    <div className="app-container">
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <div className="logo">BlockMarket.</div>
        <div className={`wallet-badge ${account ? '' : 'disconnected'}`}>
          <span className="dot">{account ? '🟢' : '🔴'}</span>
          {account
            ? `${account.substring(0, 6)}...${account.substring(38)}`
            : 'Wallet Disconnected'}
        </div>
      </nav>

      {/* 메인 히어로 섹션 */}
      <header className="hero-section">
        <h1 className="hero-title">Decentralized Escrow</h1>
        <p className="hero-subtitle">
          스마트 컨트랙트 기반의 가장 안전한 P2P 중고 마켓플레이스
        </p>
      </header>

      {/* 상품 그리드 */}
      <main className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="glass-card">
            {/* 상품 더미 이미지 영역 (IPFS 구조 포함) */}
            <div className="card-image-wrapper">
              <img
                src={`https://picsum.photos/seed/${product.id}/400/300`}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/400/300'
                }}
              />
            </div>

            <div className="card-content">
              <div className="card-header">
                <div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-id">Token ID: #{product.id}</div>
                </div>
                <div
                  className={`status-badge ${getStatusClass(product.state)}`}
                >
                  {STATUS_LABELS[product.state]}
                </div>
              </div>

              <div className="product-price">{product.price} ETH</div>

              <div className="card-actions">
                {account === product.seller && product.state === 0 && (
                  <>
                    <button
                      className="btn btn-ghost"
                      onClick={() => openEditModal(product)}
                    >
                      수정
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
                {account === product.seller && product.state === 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAutoConfirm(product.id)}
                  >
                    대금 자동 청구
                  </button>
                )}
                {account !== product.seller && product.state === 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDeposit(product.id, product.price)}
                  >
                    안전결제 예치
                  </button>
                )}
                {account === product.buyer && product.state === 1 && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirm(product.id)}
                    >
                      구매 확정
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDispute(product.id)}
                    >
                      이의 제기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 등록 플로팅 버튼 */}
      <button className="fab" onClick={() => setIsModalOpen(true)}>
        +
      </button>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? '상품 수정하기' : '새 상품 등록'}</h2>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>이미지 파일 (IPFS 연동)</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFile: e.target.files[0] })
                  }
                />
              </div>
              <div className="input-group">
                <label>상품명</label>
                <input
                  placeholder="무엇을 판매하시나요?"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>판매 가격 (ETH)</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.00 ETH"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', marginTop: '10px' }}
              >
                {editingId
                  ? '블록체인에 수정 사항 배포'
                  : '스마트 컨트랙트 등록'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
